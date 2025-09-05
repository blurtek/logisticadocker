import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import { es } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { Plus, Clock, MapPin, Phone, Package, TrendingUp, AlertCircle, CheckCircle, AlertTriangle, DollarSign } from 'lucide-react';
import DeliveryForm from '../components/DeliveryForm';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales: { es },
});

interface Delivery {
  id: string;
  address: string;
  material: string;
  documentNumber: string;
  transporter: string;
  scheduledDate: string;
  scheduledTime: string;
  customerObservations?: string;
  customerPhone: string;
  hasPickup: boolean;
  pickupItems?: string;
  deliveredMaterials?: string;
  status: string;
  isPaid: boolean;
  paymentAmount?: number;
}

const Dashboard: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [todayDeliveries, setTodayDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    pendingPayments: 0,
    totalAmount: 0,
    delayed: 0,
    delayedDeliveries: [] as Delivery[]
  });

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const [deliveriesResponse, statsResponse] = await Promise.all([
        axios.get('/api/deliveries'),
        axios.get('/api/deliveries/stats')
      ]);
      
      const allDeliveries = deliveriesResponse.data;
      const statsData = statsResponse.data;
      
      setDeliveries(allDeliveries);
      
      // Filtrar entregas de hoy
      const today = new Date().toISOString().split('T')[0];
      const todayData = allDeliveries.filter((d: Delivery) => d.scheduledDate === today);
      setTodayDeliveries(todayData);
      
      // Calcular estadísticas
      const pending = allDeliveries.filter((d: Delivery) => !['COMPLETADO'].includes(d.status)).length;
      const completed = allDeliveries.filter((d: Delivery) => d.status === 'COMPLETADO').length;
      
      setStats({
        total: allDeliveries.length,
        pending,
        completed,
        pendingPayments: statsData.unpaid.count,
        totalAmount: statsData.unpaid.totalAmount,
        delayed: statsData.delayed.count,
        delayedDeliveries: statsData.delayed.deliveries
      });
    } catch (error) {
      console.error('Error fetching deliveries:', error);
    } finally {
      setLoading(false);
    }
  };

  const events = deliveries.map(delivery => ({
    id: delivery.id,
    title: `${delivery.material} - ${delivery.address}`,
    start: new Date(`${delivery.scheduledDate}T${delivery.scheduledTime}`),
    end: new Date(`${delivery.scheduledDate}T${delivery.scheduledTime}`),
    resource: delivery
  }));

  const getStatusColor = (status: string) => {
    const colors = {
      'PREPARACION': 'bg-yellow-100 text-yellow-800',
      'TRANSITO': 'bg-blue-100 text-blue-800',
      'REPARTO': 'bg-purple-100 text-purple-800',
      'ERROR_LLAMADA': 'bg-red-100 text-red-800',
      'AUSENTE': 'bg-orange-100 text-orange-800',
      'ERROR_PEDIDO': 'bg-red-100 text-red-800',
      'COMPLETADO': 'bg-green-100 text-green-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 lg:px-6">
      {/* Header con botón Nueva Entrega */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 sm:py-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 text-sm sm:text-base">Panel de control de entregas</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Entrega
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Pendientes</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Completadas</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* KPI de Entregas Retrasadas - ALERTA ROJA */}
        <div className={`rounded-xl shadow-sm p-4 sm:p-6 ${stats.delayed > 0 ? 'bg-red-50 border-2 border-red-200 animate-pulse' : 'bg-white'}`}>
          <div className="flex items-center">
            <div className={`p-2 rounded-lg ${stats.delayed > 0 ? 'bg-red-100' : 'bg-orange-100'}`}>
              <AlertTriangle className={`w-6 h-6 ${stats.delayed > 0 ? 'text-red-600' : 'text-orange-600'}`} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Retrasadas</p>
              <p className={`text-xl sm:text-2xl font-bold ${stats.delayed > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {stats.delayed}
              </p>
              {stats.delayed > 0 && (
                <p className="text-xs text-red-500 font-medium">¡URGENTE!</p>
              )}
            </div>
          </div>
        </div>

        {/* KPI de Pagos Pendientes - MEJORADO */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Por Cobrar</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
              <p className="text-xs text-red-600 font-medium">
                {stats.totalAmount.toFixed(2)}€
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Entregas Retrasadas - ALERTA CRÍTICA */}
      {stats.delayed > 0 && (
        <div className="bg-red-50 border-2 border-red-200 rounded-xl shadow-sm mb-6 animate-pulse">
          <div className="p-4 sm:p-6 border-b border-red-200">
            <div className="flex items-center">
              <AlertTriangle className="w-6 h-6 text-red-600 mr-3" />
              <h2 className="text-xl font-bold text-red-800">⚠️ ENTREGAS RETRASADAS - URGENTE</h2>
            </div>
            <p className="text-red-600 text-sm mt-1">
              {stats.delayed} entregas con fecha vencida que requieren atención inmediata
            </p>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3">
              {stats.delayedDeliveries.slice(0, 3).map((delivery) => (
                <div key={delivery.id} className="bg-white border border-red-200 rounded-lg p-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg font-semibold text-red-600">
                          {delivery.documentNumber}
                        </span>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                          {delivery.status}
                        </span>
                        <span className="text-sm text-red-500 font-medium">
                          Vencida: {new Date(delivery.scheduledDate).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium">{delivery.material}</p>
                      <p className="text-gray-600 text-sm">{delivery.address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{delivery.customerPhone}</span>
                      {!delivery.isPaid && delivery.paymentAmount && delivery.paymentAmount > 0 && (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                          {delivery.paymentAmount}€
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {stats.delayedDeliveries.length > 3 && (
                <div className="text-center py-2">
                  <p className="text-red-600 text-sm font-medium">
                    Y {stats.delayedDeliveries.length - 3} entregas más retrasadas...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Entregas de Hoy */}
      <div className="bg-white rounded-xl shadow-sm mb-6">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Entregas de Hoy</h2>
          <p className="text-gray-600 text-sm">
            {todayDeliveries.length} entregas programadas
          </p>
        </div>
        <div className="p-4 sm:p-6">
          {todayDeliveries.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No hay entregas programadas para hoy</p>
            </div>
          ) : (
            <div className="space-y-4">
              {todayDeliveries.map((delivery) => (
                <div key={delivery.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <div className="flex items-center text-lg font-semibold text-gray-900">
                          <Clock className="w-5 h-5 text-gray-400 mr-2" />
                          {delivery.scheduledTime}
                        </div>
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                          {delivery.status}
                        </span>
                        {!delivery.isPaid && delivery.paymentAmount && delivery.paymentAmount > 0 && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                            Por cobrar: {delivery.paymentAmount}€
                          </span>
                        )}
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-start mb-2">
                            <MapPin className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700 break-words">{delivery.address}</span>
                          </div>
                          <div className="flex items-start mb-2">
                            <Package className="w-4 h-4 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{delivery.material}</span>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center mb-2">
                            <Phone className="w-4 h-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-700">{delivery.customerPhone}</span>
                          </div>
                          {delivery.hasPickup && (
                            <div className="flex items-center text-sm text-orange-600">
                              <TrendingUp className="w-4 h-4 mr-2" />
                              Incluye recogida: {delivery.pickupItems || 'Material por definir'}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Calendario - Solo en desktop */}
      <div className="hidden lg:block bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Calendario de Entregas</h2>
        </div>
        <div className="p-6">
          <div className="h-96">
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              views={['month', 'week', 'day']}
              defaultView="week"
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                noEventsInRange: "No hay eventos en este rango."
              }}
            />
          </div>
        </div>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <DeliveryForm
          onClose={() => setShowForm(false)}
          onSave={() => {
            fetchDeliveries();
            setShowForm(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
