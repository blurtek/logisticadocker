import React, { useState } from 'react';
import axios from 'axios';
import { Search, Package, MapPin, Clock, Phone, Calendar, User, AlertCircle } from 'lucide-react';

interface DeliveryStatus {
  id: string;
  documentNumber: string;
  status: string;
  scheduledDate: string;
  scheduledTime: string;
  address: string;
  material: string;
  transporter: string;
  customerObservations?: string;
  hasPickup: boolean;
  pickupItems?: string;
  deliveredMaterials?: string;
  isPaid: boolean;
  paymentAmount?: number;
  createdAt: string;
}

function App() {
  const [documentNumber, setDocumentNumber] = useState('');
  const [delivery, setDelivery] = useState<DeliveryStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documentNumber.trim()) return;

    setLoading(true);
    setError('');
    setDelivery(null);

    try {
      const response = await axios.post('/api/public/search', {
        documentNumber: documentNumber.trim()
      });
      setDelivery(response.data);
    } catch (error: any) {
      if (error.response?.status === 404) {
        setError('No se encontró ningún pedido con ese número de documento');
      } else {
        setError('Error al buscar el pedido. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status: string) => {
    const statusMap = {
      'PREPARACION': { 
        label: 'En Preparación', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        description: 'Tu pedido está siendo preparado en nuestro almacén'
      },
      'TRANSITO': { 
        label: 'En Tránsito', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        description: 'Tu pedido está en camino hacia tu dirección'
      },
      'REPARTO': { 
        label: 'En Reparto', 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        description: 'Nuestro transportista está realizando la entrega'
      },
      'ERROR_LLAMADA': { 
        label: 'Error al Contactar', 
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'No hemos podido contactar contigo. Por favor, llámanos'
      },
      'AUSENTE': { 
        label: 'Ausente', 
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        description: 'No se encontró a nadie en la dirección de entrega'
      },
      'ERROR_PEDIDO': { 
        label: 'Error en Pedido', 
        color: 'bg-red-100 text-red-800 border-red-200',
        description: 'Ha ocurrido un problema con tu pedido. Contacta con nosotros'
      },
      'COMPLETADO': { 
        label: 'Completado', 
        color: 'bg-green-100 text-green-800 border-green-200',
        description: '¡Tu pedido ha sido entregado correctamente!'
      }
    };
    return statusMap[status as keyof typeof statusMap] || {
      label: status,
      color: 'bg-gray-100 text-gray-800 border-gray-200',
      description: 'Estado del pedido'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">MueblesWow</h1>
          <p className="text-gray-600 text-lg">Consulta el estado de tu pedido</p>
        </div>

        {/* Search Form */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-md p-6">
            <div className="mb-4">
              <label htmlFor="document" className="block text-sm font-medium text-gray-700 mb-2">
                Número de Documento
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="document"
                  value={documentNumber}
                  onChange={(e) => setDocumentNumber(e.target.value)}
                  placeholder="Ej: 12345678A"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <Search className="w-5 h-5 mr-2" />
                  Buscar Pedido
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <div className="ml-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Information */}
        {delivery && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              {/* Status Header */}
              <div className="px-6 py-4 bg-gray-50 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Estado del Pedido
                  </h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusInfo(delivery.status).color}`}>
                    {getStatusInfo(delivery.status).label}
                  </span>
                </div>
                <p className="text-gray-600 mt-1">
                  {getStatusInfo(delivery.status).description}
                </p>
              </div>

              {/* Delivery Details */}
              <div className="px-6 py-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Package className="w-5 h-5 text-indigo-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Material</p>
                        <p className="text-sm text-gray-600">{delivery.material}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-indigo-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Dirección de Entrega</p>
                        <p className="text-sm text-gray-600">{delivery.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <User className="w-5 h-5 text-indigo-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Transportista</p>
                        <p className="text-sm text-gray-600">{delivery.transporter}</p>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Calendar className="w-5 h-5 text-indigo-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Fecha Programada</p>
                        <p className="text-sm text-gray-600">
                          {new Date(delivery.scheduledDate).toLocaleDateString('es-ES', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-indigo-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Hora Programada</p>
                        <p className="text-sm text-gray-600">{delivery.scheduledTime}</p>
                      </div>
                    </div>

                    {delivery.hasPickup && (
                      <div className="flex items-start space-x-3">
                        <Package className="w-5 h-5 text-orange-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Recogida Incluida</p>
                          <p className="text-sm text-gray-600">
                            {delivery.pickupItems || 'Material a recoger por definir'}
                          </p>
                        </div>
                      </div>
                    )}

                    {!delivery.isPaid && delivery.paymentAmount && delivery.paymentAmount > 0 && (
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Pago Pendiente</p>
                          <p className="text-sm text-gray-600">
                            Cantidad a abonar: <span className="font-semibold">{delivery.paymentAmount}€</span>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Customer Observations */}
                {delivery.customerObservations && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-900 mb-1">Observaciones</p>
                    <p className="text-sm text-gray-600">{delivery.customerObservations}</p>
                  </div>
                )}

                {/* Contact Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900 mb-2">¿Necesitas ayuda?</p>
                  <p className="text-sm text-gray-600">
                    Si tienes alguna pregunta sobre tu pedido, no dudes en contactarnos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>&copy; 2024 MueblesWow. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  );
}

export default App;
