import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Eye, Package } from 'lucide-react';
import DeliveryForm from '../components/DeliveryForm';

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

const Deliveries: React.FC = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDelivery, setEditingDelivery] = useState<Delivery | null>(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get('/api/deliveries');
      setDeliveries(response.data || []);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setDeliveries([]); // Asegurar que siempre sea un array
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta entrega?')) {
      try {
        await axios.delete(`/api/deliveries/${id}`);
        fetchDeliveries();
      } catch (error) {
        console.error('Error deleting delivery:', error);
      }
    }
  };

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

  const getStatusLabel = (status: string) => {
    const labels = {
      'PREPARACION': 'Preparación',
      'TRANSITO': 'Tránsito',
      'REPARTO': 'Reparto',
      'ERROR_LLAMADA': 'Error al llamar',
      'AUSENTE': 'Ausente',
      'ERROR_PEDIDO': 'Error en pedido',
      'COMPLETADO': 'Completado'
    };
    return labels[status as keyof typeof labels] || status;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 lg:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-4 sm:py-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Gestión de Entregas</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            {deliveries.length} entregas registradas
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Nueva Entrega
        </button>
      </div>

      {/* Modal de formulario */}
      {showForm && (
        <DeliveryForm
          delivery={editingDelivery}
          onClose={() => {
            setShowForm(false);
            setEditingDelivery(null);
          }}
          onSave={() => {
            fetchDeliveries();
            setShowForm(false);
            setEditingDelivery(null);
          }}
        />
      )}

      {/* Lista de entregas */}
      <div className="space-y-4">
        {deliveries && deliveries.length > 0 && deliveries.map((delivery) => (
          <div key={delivery.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 sm:p-6">
              {/* Header de la tarjeta */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="text-lg font-semibold text-indigo-600">
                      {delivery.documentNumber}
                    </span>
                    <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(delivery.status)}`}>
                      {getStatusLabel(delivery.status)}
                    </span>
                    {!delivery.isPaid && delivery.paymentAmount && delivery.paymentAmount > 0 && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        Por cobrar: {delivery.paymentAmount}€
                      </span>
                    )}
                    {delivery.hasPickup && (
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800">
                        Con recogida
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">
                    {delivery.material}
                  </h3>
                  <p className="text-gray-600 text-sm break-words">
                    {delivery.address}
                  </p>
                </div>
                
                {/* Botones de acción */}
                <div className="flex space-x-2 flex-shrink-0">
                  <button 
                    onClick={() => {
                      setEditingDelivery(delivery);
                      setShowForm(true);
                    }}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(delivery.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Detalles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Fecha y Hora:</span>
                  <p className="text-gray-600">
                    {new Date(delivery.scheduledDate).toLocaleDateString('es-ES')} a las {delivery.scheduledTime}
                  </p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-900">Transportista:</span>
                  <p className="text-gray-600">{delivery.transporter}</p>
                </div>
                
                <div>
                  <span className="font-medium text-gray-900">Teléfono:</span>
                  <p className="text-gray-600">
                    <a href={`tel:${delivery.customerPhone}`} className="hover:text-indigo-600">
                      {delivery.customerPhone}
                    </a>
                  </p>
                </div>

                {delivery.hasPickup && delivery.pickupItems && (
                  <div className="sm:col-span-2 lg:col-span-1">
                    <span className="font-medium text-gray-900">Material a recoger:</span>
                    <p className="text-gray-600">{delivery.pickupItems}</p>
                  </div>
                )}

                {delivery.customerObservations && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <span className="font-medium text-gray-900">Observaciones:</span>
                    <p className="text-gray-600 mt-1">{delivery.customerObservations}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {(!deliveries || deliveries.length === 0) && !loading && (
          <div className="text-center py-12">
            <div className="mx-auto h-24 w-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay entregas registradas
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza creando tu primera entrega
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nueva Entrega
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Deliveries;
