import React from 'react';
import { User, CreditCard, Settings, LogOut, Zap, Calendar, Crown } from 'lucide-react';
import { User as UserType } from '../types';

interface AccountPageProps {
  user: UserType;
  onUpgradeClick: () => void;
  onLogout: () => void;
  onBackToApp: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  user,
  onUpgradeClick,
  onLogout,
  onBackToApp,
}) => {
  const getPlanInfo = (plan: string) => {
    switch (plan) {
      case 'starter':
        return { name: 'Starter', color: 'text-blue-600', bgColor: 'bg-blue-100' };
      case 'pro':
        return { name: 'Pro', color: 'text-purple-600', bgColor: 'bg-purple-100' };
      default:
        return { name: 'Ücretsiz', color: 'text-gray-600', bgColor: 'bg-gray-100' };
    }
  };

  const planInfo = getPlanInfo(user.plan);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onBackToApp}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ← Uygulamaya Dön
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Hesap Ayarları</h1>
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Çıkış</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-1">{user.name}</h2>
                <p className="text-gray-600 mb-4">{user.email}</p>
                
                <div className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full ${planInfo.bgColor}`}>
                  {user.plan === 'pro' && <Crown className="w-4 h-4 text-purple-600" />}
                  <span className={`text-sm font-medium ${planInfo.color}`}>
                    {planInfo.name} Plan
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Credits Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Kredi Durumu</span>
                </h3>
                {user.plan === 'free' && (
                  <button
                    onClick={onUpgradeClick}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                  >
                    Yükselt
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{user.credits}</div>
                  <div className="text-sm text-gray-600">Kalan Kredi</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {user.plan === 'free' ? '∞' : user.plan === 'starter' ? '50' : '100'}
                  </div>
                  <div className="text-sm text-gray-600">Aylık Limit</div>
                </div>
              </div>

              {user.plan === 'free' && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Ücretsiz Plan:</strong> Ayda sadece 2 kredi alırsınız. 
                    Daha fazla kredi için planınızı yükseltin.
                  </p>
                </div>
              )}
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-gray-500" />
                <span>Hesap Bilgileri</span>
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">E-posta</span>
                  <span className="text-gray-900 font-medium">{user.email}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Plan</span>
                  <span className={`font-medium ${planInfo.color}`}>{planInfo.name}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600">Üyelik Tarihi</span>
                  <span className="text-gray-900 font-medium">
                    {user.createdAt.toLocaleDateString('tr-TR')}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">Hesap ID</span>
                  <span className="text-gray-900 font-mono text-sm">{user.id}</span>
                </div>
              </div>
            </div>

            {/* Usage Guidelines */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Kullanım Kuralları
              </h3>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Genel Kurallar</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Her görüntü üretimi 1 kredi harcar</li>
                    <li>Başarısız üretimler için kredi iadesi yapılır</li>
                    <li>Günlük maksimum 50 görüntü üretimi sınırı</li>
                    <li>Ticari kullanım için Pro plan gereklidir</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Yasak İçerikler</h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Şiddet, nefret söylemi veya uygunsuz içerik</li>
                    <li>Telif hakkı olan karakterler veya markalar</li>
                    <li>Kişisel fotoğrafları izinsiz kullanım</li>
                    <li>Yanıltıcı veya sahte içerik üretimi</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};