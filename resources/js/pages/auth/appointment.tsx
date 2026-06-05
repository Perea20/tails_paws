import { useForm, Head } from '@inertiajs/react';
import { useState, useEffect, FormEvent, useMemo } from 'react';

interface RecordType {
  id: number;
  name: string;
}

interface Pet {
  id: number;
  name: string;
}

interface AppointmentProps {
  recordTypes: RecordType[];
  pets: Pet[];
}

interface SlotsResponse {
  slots: string[];
  hasDuplicate: boolean;
}

export default function Appointment({ recordTypes, pets }: AppointmentProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [isDuplicate, setIsDuplicate] = useState<boolean>(false);
  
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());

  const { data, setData, post, processing, errors } = useForm({
    pet_id: '',
    record_type_id: '',
    date: '',
    time: ''
  });

  useEffect(() => {
    if (!data.date) {
      setAvailableSlots([]);
      setIsDuplicate(false);
      return;
    }

    setLoadingSlots(true);
    fetch(`/appointments/available-slots?date=${data.date}&pet_id=${data.pet_id}`)
      .then((res) => res.json())
      .then((res: SlotsResponse) => {
        setIsDuplicate(res.hasDuplicate);

        if (res.hasDuplicate) {
          setAvailableSlots([]);
          setData('time', '');
          return;
        }

        const today = new Date();
        const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

        if (data.date === todayString) {
          const now = new Date();
          const currentHour = now.getHours();
          const currentMinute = now.getMinutes();

          const filteredSlots = res.slots.filter((slot) => {
            const [slotHourStr, slotMinuteStr] = slot.split(':');
            const slotHour = parseInt(slotHourStr, 10);
            const slotMinute = parseInt(slotMinuteStr, 10);

            if (slotHour > currentHour) return true;
            if (slotHour === currentHour && slotMinute > currentMinute) return true;
            return false;
          });

          setAvailableSlots(filteredSlots);
        } else {
          setAvailableSlots(res.slots);
        }
        
        setData('time', ''); 
      })
      .catch((err) => console.error('Error al cargar horas disponibles:', err))
      .finally(() => setLoadingSlots(false));
  }, [data.date, data.pet_id]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isDuplicate) return;
    post('/appointments');
  };

  const generatedDays = useMemo(() => {
    const today = new Date();
    const firstDayIndex = (new Date(currentYear, currentMonth, 1).getDay() + 6) % 7;
    const totalDays = new Date(currentYear, currentMonth + 1, 0).getDate();

    const dayButtons = [];

    for (let i = 0; i < firstDayIndex; i++) {
      dayButtons.push(<div key={`empty-${i}`} />);
    }

    for (let day = 1; day <= totalDays; day++) {
      const currentLoopDate = new Date(currentYear, currentMonth, day);
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const isSunday = currentLoopDate.getDay() === 0;
      const compareToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
      const isDisabled = isSunday || currentLoopDate < compareToday;

      const isSelected = data.date === dateString;
      const isTodayBtn = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;

      dayButtons.push(
        <button
          key={`${currentYear}-${currentMonth}-${day}`}
          type="button"
          disabled={isDisabled}
          onClick={() => setData('date', dateString)}
          className={`h-10 w-full text-sm font-medium rounded-xl transition-colors flex items-center justify-center select-none
            ${isDisabled ? 'text-gray-200 cursor-not-allowed opacity-40 hover:bg-transparent' : 'text-gray-800 hover:bg-emerald-50 hover:text-emerald-700'}
            ${isSelected ? '!bg-emerald-700 !text-white font-bold shadow-sm' : ''}
            ${isTodayBtn && !isSelected ? 'text-emerald-700 font-extrabold underline decoration-2 underline-offset-4' : ''}
          `}
        >
          {day}
        </button>
      );
    }
    return dayButtons;
  }, [currentMonth, currentYear, data.date]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Head title="Pedir cita online" />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reserva tu cita online</h1>
            <p className="text-gray-500 mt-1 text-sm">Selecciona los datos y tu hueco en el calendario.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">¿Para qué mascota es la cita?</label>
              <select
                name="pet_id"
                value={data.pet_id}
                onChange={(e) => setData('pet_id', e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 focus:bg-white transition-colors text-gray-900 text-sm"
              >
                <option value="">Selecciona una mascota...</option>
                {pets && pets.map((pet) => (
                  <option key={pet.id} value={pet.id}>{pet.name}</option>
                ))}
              </select>
              {errors.pet_id && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.pet_id}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Motivo de la visita</label>
              <select
                name="record_type_id"
                value={data.record_type_id}
                onChange={(e) => setData('record_type_id', e.target.value)}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 focus:bg-white transition-colors text-gray-900 text-sm"
              >
                <option value="">Selecciona el motivo...</option>
                {recordTypes && recordTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-full">
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">
                Selecciona la fecha de la cita
              </label>
              
              <div className="border border-gray-100 rounded-3xl bg-white p-5 shadow-sm text-gray-800">

                <div className="flex items-center justify-between mb-4 px-1">
                  <button
                    type="button"
                    disabled={currentMonth === new Date().getMonth() && currentYear === new Date().getFullYear()}
                    onClick={() => {
                      if (currentMonth === 0) {
                        setCurrentMonth(11);
                        setCurrentYear(currentYear - 1);
                      } else {
                        setCurrentMonth(currentMonth - 1);
                      }
                    }}
                    className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-bold text-lg select-none"
                  >
                    &lt;
                  </button>

                  <div className="font-extrabold text-gray-900 capitalize text-base select-none">
                    {new Date(currentYear, currentMonth)
                      .toLocaleString('es-ES', { month: 'long', year: 'numeric' })
                      .replace(' de ', ' ')}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (currentMonth === 11) {
                        setCurrentMonth(0);
                        setCurrentYear(currentYear + 1);
                      } else {
                        setCurrentMonth(currentMonth + 1);
                      }
                    }}
                    className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors font-bold text-lg select-none"
                  >
                    &gt;
                  </button>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 uppercase mb-2 select-none">
                  <div>lu</div><div>ma</div><div>mi</div><div>ju</div><div>vi</div><div>sá</div><div>do</div>
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {generatedDays}
                </div>
              </div>

              {data.date && (
                <p className="text-xs text-emerald-700 font-bold mt-2 flex items-center px-1">
                  ✓ Fecha seleccionada: {data.date.split('-').reverse().join('/')}
                </p>
              )}
              {errors.date && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Hora disponible</label>
              <select
                name="time"
                value={data.time}
                onChange={(e) => setData('time', e.target.value)}
                disabled={!data.date || loadingSlots || isDuplicate}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 focus:bg-white transition-colors text-gray-900 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingSlots ? (
                  <option>Buscando intervalos libres...</option>
                ) : !data.date ? (
                  <option>Por favor, selecciona una fecha primero</option>
                ) : isDuplicate ? (
                  <option>No disponible por cita existente</option>
                ) : availableSlots.length === 0 ? (
                  <option>No quedan turnos disponibles para este día</option>
                ) : (
                  <>
                    <option value="">Selecciona una hora...</option>
                    {availableSlots.map((slot) => (
                      <option key={slot} value={`${slot}:00`}>
                        {slot} hs
                      </option>
                    ))}
                  </>
                )}
              </select>
              {errors.time && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.time}</p>}
            </div>

            {isDuplicate && (
              <div className="p-3 text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-xl font-medium" role="alert">
                Ya tienes una cita este día con este animal.
              </div>
            )}

            <button
              type="submit"
              disabled={processing || !data.time || !data.date || isDuplicate}
              className="w-full bg-emerald-700 text-white font-bold py-3.5 rounded-xl hover:bg-emerald-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-sm text-sm"
            >
              {processing ? 'Procesando tu Reserva...' : 'Confirmar Cita Online'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}