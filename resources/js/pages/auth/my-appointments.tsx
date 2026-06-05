import { Head, usePage, Link } from '@inertiajs/react';
import React from 'react';

interface Pet {
  id: number;
  name: string;
}

interface RecordType {
  id: number;
  name: string;
}

interface Staff {
  id: number;
  name: string;
  lastname?: string;
}

interface AppointmentData {
  id: number;
  date: string;
  time: string;
  pet: Pet;
  record_type: RecordType;
  staff?: Staff;
}

const formatHumanDate = (dateString: string) => {
  if (!dateString) return '—';
  const date = new Date(dateString);
  const formatted = date.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return formatted.replace(/\b\w/g, (l) => l.toUpperCase());
};

const formatTime = (timeString: string) => {
  if (!timeString) return '—';
  return timeString.substring(0, 5);
};

export default function MyAppointments() {
  const { client = {}, appointments = [], pastAppointments = [] } = usePage().props as any;

  const renderAppointmentsTable = (list: AppointmentData[], isEmptyMessage: string) => {
    if (!list || list.length === 0) {
      return (
        <div className="py-12 text-center border border-dashed border-neutral-200 bg-white rounded-xl">
          <p className="text-sm text-neutral-400 font-light italic">{isEmptyMessage}</p>
        </div>
      );
    }

    return (
      <div className="w-full overflow-hidden bg-white border border-emerald-100 rounded-xl shadow-sm">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="border-b border-emerald-100 bg-emerald-50/40 text-emerald-800/80 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-3.5 font-medium">Mascota</th>
              <th className="px-6 py-3.5 font-medium">Motivo de la Visita</th>
              <th className="px-6 py-3.5 font-medium">Especialista</th>
              <th className="px-6 py-3.5 font-medium">Fecha</th>
              <th className="px-6 py-3.5 font-medium text-right">Hora</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 text-neutral-600">
            {list.map((app: any) => (
              <tr key={app.id} className="hover:bg-emerald-50/10 transition-colors duration-150">
                <td className="px-6 py-4 font-normal text-neutral-950 text-base">
                  {app.pet ? app.pet.name : '—'}
                </td>
                <td className="px-6 py-4 text-xs font-medium uppercase tracking-wider text-neutral-550">
                  {app.record_type ? app.record_type.name.replace(/_/g, ' ') : 'Consulta'}
                </td>
                <td className="px-6 py-4 text-sm text-neutral-700">
                  {app.staff 
                    ? `Dr/a. ${app.staff.name} ${app.staff.lastname || ''}` 
                    : 'Asignando especialista...'}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-neutral-500">
                  {formatHumanDate(app.date).replace(/ De /g, ' ')}
                </td>
                <td className="px-6 py-4 text-sm text-right font-mono font-bold text-emerald-700">
                  <span className="bg-emerald-50/60 px-2.5 py-1 rounded-md">
                    {formatTime(app.time)} HS
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <>
      <Head title="Mis citas" />
      
      <div className="fixed inset-0 bg-white min-h-screen text-neutral-800 w-screen overflow-y-auto antialiased selection:bg-emerald-100 z-50">
        <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-10 space-y-12">
          
          <div className="flex justify-center pb-6 border-b border-neutral-100">
            <Link href="/">
              <img src="/img/tplogotxt.png" alt="Logo Tails & Paws" className="h-30 w-auto" />
            </Link>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-8 border-b border-emerald-100 gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-extralight tracking-tight text-neutral-900">Mis citas</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-emerald-800/80">
                <p><span className="text-neutral-400 font-normal">Propietario: </span> {client?.name || 'Usuario'} {client?.lastname || client?.last_name || ''}</p>
                <p><span className="text-neutral-400 font-normal">Email: </span> {client?.email || '—'}</p>
                <p><span className="text-neutral-400 font-normal">Teléfono: </span> {client?.phone || '—'}</p>
              </div>
            </div>

            <Link href="/appointments/create" className="text-xs font-semibold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg shadow-sm transition-all duration-200 active:scale-95">
              Pedir nueva cita
            </Link>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-light tracking-tight text-neutral-900">
              Próximas visitas programadas
            </h2>
            {renderAppointmentsTable(appointments, "No tienes ninguna cita médica programada en este momento.")}
          </div>

          <hr className="border-neutral-100" />

          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-light tracking-tight text-neutral-900">
              Historial de visitas pasadas
            </h2>
            {renderAppointmentsTable(pastAppointments, "No constan visitas médicas anteriores en tu historial.")}
          </div>

        </div>
      </div>
    </>
  );
}

MyAppointments.layout = (page: any) => page;