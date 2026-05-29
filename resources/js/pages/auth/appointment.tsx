import { useForm, Head, Link } from '@inertiajs/react';
import { useState, useEffect, FormEvent } from 'react';

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

export default function Appointment({ recordTypes, pets }: AppointmentProps) {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);

  // Estados para el control del Calendario Visual del Mes
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<number>(today.getMonth());
  const [currentYear, setCurrentYear] = useState<number>(today.getFullYear());

  const { data, setData, post, processing, errors } = useForm({
    pet_id: '',
    record_type_id: '',
    date: '',
    time: ''
  });

  // Petición asíncrona de horas libres al cambiar la fecha seleccionada
  useEffect(() => {
    if (!data.date) {
      setAvailableSlots([]);
      return;
    }

    setLoadingSlots(true);
    fetch(`/appointments/available-slots?date=${data.date}`)
      .then((res) => res.json())
      .then((slots: string[]) => {
        setAvailableSlots(slots);
        setData('time', ''); 
      })
      .catch((err) => console.error('Error al cargar horas disponibles:', err))
      .finally(() => setLoadingSlots(false));
  }, [data.date]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    post('/appointments');
  };

  // --- LÓGICA GENERADORA DEL CALENDARIO VISUAL ---
  const monthsNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const daysOfWeekHeader = ["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"];

  // Cambiar de mes
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  // Generar la cuadrícula exacta de días
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
  // Ajustar índice para que el Lunes sea 0 y Domingo sea 6
  const startingDay = firstDayIndex === 0 ? 6 : firstDayIndex - 1;
  const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const calendarCells = [];
  // Rellenar espacios vacíos del mes anterior
  for (let i = 0; i < startingDay; i++) {
    calendarCells.push(null);
  }
  // Añadir los días reales del mes
  for (let day = 1; day <= totalDaysInMonth; day++) {
    calendarCells.push(day);
  }

  // Comprobar restricciones del día (Pasados y Domingos)
  const isDateDisabled = (day: number | null) => {
    if (!day) return true;
    const cellDate = new Date(currentYear, currentMonth, day);
    
    // Resetear horas para comparar limpiamente solo calendarios
    const cleanToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    // Deshabilitar si es anterior a hoy o si cae en Domingo (0)
    return cellDate < cleanToday || cellDate.getDay() === 0;
  };

  const handleDateSelect = (day: number) => {
    // Formatear a YYYY-MM-DD local
    const monthString = String(currentMonth + 1).padStart(2, '0');
    const dayString = String(day).padStart(2, '0');
    const selectedDateStr = `${currentYear}-${monthString}-${dayString}`;
    
    setData('date', selectedDateStr);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Head title="Pedir Cita Online" />

      <main className="flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-xl bg-white rounded-3xl border border-gray-100 p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Reserva tu Cita Online</h1>
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
              {errors.record_type_id && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.record_type_id}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Selecciona la fecha en el calendario</label>
              
              <div className="border border-gray-200 rounded-2xl p-4 bg-gray-50/50">
                <div className="flex items-center justify-between mb-4 px-1">
                  <span className="text-sm font-bold text-gray-800">
                    {monthsNames[currentMonth]} {currentYear}
                  </span>
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      &larr;
                    </button>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-600 transition-colors"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-gray-400 mb-2">
                  {daysOfWeekHeader.map(day => (
                    <div key={day} className="py-1">{day}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarCells.map((day, index) => {
                    if (day === null) {
                      return <div key={`empty-${index}`} />;
                    }

                    const monthString = String(currentMonth + 1).padStart(2, '0');
                    const dayString = String(day).padStart(2, '0');
                    const cellDateStr = `${currentYear}-${monthString}-${dayString}`;
                    const isSelected = data.date === cellDateStr;
                    const disabled = isDateDisabled(day);

                    return (
                      <button
                        key={`day-${day}`}
                        type="button"
                        disabled={disabled}
                        onClick={() => handleDateSelect(day)}
                        className={`
                          py-2.5 text-xs font-semibold rounded-xl transition-all relative
                          ${isSelected 
                            ? 'bg-emerald-700 text-white shadow-sm scale-105 z-10' 
                            : 'text-gray-800 hover:bg-emerald-50 hover:text-emerald-700'
                          }
                          ${disabled ? 'opacity-25 cursor-not-allowed hover:bg-transparent hover:text-gray-800' : ''}
                        `}
                      >
                        {day}
                      </button>
                    );
                  })}
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
              <label className="block text-xs font-bold text-gray-400 uppercase mb-2 tracking-wider">Hora disponible (Intervalos de 30 min)</label>
              <select
                name="time"
                value={data.time}
                onChange={(e) => setData('time', e.target.value)}
                disabled={!data.date || loadingSlots}
                required
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:border-emerald-500 focus:bg-white transition-colors text-gray-900 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingSlots ? (
                  <option>Buscando intervalos libres...</option>
                ) : !data.date ? (
                  <option>Por favor, selecciona una fecha en el calendario primero</option>
                ) : availableSlots.length === 0 ? (
                  <option>Clínica cerrada o sin cupos para este día</option>
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

            <button
              type="submit"
              disabled={processing || !data.time || !data.date}
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