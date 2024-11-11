import React from 'react';
import { QrCode, CreditCard, Settings } from 'lucide-react';
import styles from '@/styles/home.module.css';

export default function Solutions({ id }: { id: string }) {
  const solutions = [
    {
      icon: <Settings className="text-accent size-8" />,
      title: 'Smart Digital Menu System',
      description: 'Create, update, and manage your menu in real-time',
      features: ['Real-time updates', 'Multi-language support', 'Rich media integration', 'Category management'],
    },
    {
      icon: <QrCode className="text-accent size-8" />,
      title: 'Contactless QR Ordering',
      description: 'Enable seamless ordering through customized QR codes',
      features: ['Custom QR generation', 'Table-specific menus', 'Direct ordering system', 'Order tracking'],
    },
    {
      icon: <CreditCard className="text-accent size-8" />,
      title: 'Secure Payment Solutions',
      description: 'Offer multiple payment options for customer convenience',
      features: ['Multiple payment methods', 'Secure transactions', 'Split bill feature', 'Digital receipts'],
    },
  ];

  return (
    <div className={`py-24 ${styles.sectionGradient}`} id={id}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className={styles.sectionTitle}>
            Comprehensive Digital Solutions
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Transform your restaurant operations with our innovative digital solutions
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {solutions.map((solution, index) => (
            <div key={index} className={`${styles.cardGradient} rounded-2xl p-8 transition-shadow hover:shadow-xl`}>
              <div className={`${styles.iconGradient} mb-6 inline-block`}>
                {solution.icon}
              </div>
              <h3 className="mb-3 text-xl font-semibold text-gray-900">{solution.title}</h3>
              <p className="mb-6 text-gray-600">{solution.description}</p>
              <ul className="space-y-3">
                {solution.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <span className="mr-2 size-1.5 rounded-full bg-indigo-600"></span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}