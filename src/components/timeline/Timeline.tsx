import type { TimelineEvent } from '../../types';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface TimelineProps {
  events: TimelineEvent[];
  vertical?: boolean;
}

export default function Timeline({ events, vertical = true }: TimelineProps) {
  return (
    <div className={`relative ${vertical ? 'pl-4' : 'flex items-center w-full'}`}>
      {vertical && (
        <motion.div 
          className="absolute left-6 top-6 bottom-6 w-0.5 bg-border-medium rounded-full"
          initial={{ height: 0 }}
          whileInView={{ height: 'calc(100% - 48px)' }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />
      )}

      <div className={`flex ${vertical ? 'flex-col space-y-8' : 'w-full justify-between items-start'}`}>
        {events.map((event, index) => {
          const isCompleted = event.status === 'completed';
          const isActive = event.status === 'active';

          return (
            <motion.div 
              key={event.id}
              initial={{ opacity: 0, x: vertical ? -20 : 0, y: vertical ? 0 : 20 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2, duration: 0.5 }}
              className={`relative flex ${vertical ? 'items-start' : 'flex-col items-center flex-1'}`}
            >
              {/* Connector line for horizontal */}
              {!vertical && index !== events.length - 1 && (
                <div className="absolute top-4 left-[50%] right-[-50%] h-0.5 bg-border-medium z-0" />
              )}

              {/* Indicator */}
              <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-charcoal-deep ${
                isCompleted 
                  ? 'border-emerald bg-emerald/10 text-emerald' 
                  : isActive
                  ? 'border-blue-progress text-blue-progress'
                  : 'border-gray-600 text-gray-500'
              } ${vertical ? 'mr-4 flex-shrink-0' : 'mb-3'}`}>
                {isCompleted ? (
                  <Check size={14} strokeWidth={3} />
                ) : isActive ? (
                  <>
                    <span className="absolute inline-flex h-full w-full rounded-full bg-blue-progress opacity-20 animate-ping" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-blue-progress" />
                  </>
                ) : (
                  <span className="h-2 w-2 rounded-full bg-gray-600" />
                )}
              </div>

              {/* Content */}
              <div className={`${vertical ? 'pt-1' : 'text-center'}`}>
                <h4 className={`text-sm md:text-base font-semibold ${isActive || isCompleted ? 'text-white' : 'text-gray-400'}`}>
                  {event.label}
                </h4>
                {event.timestamp && (
                  <p className="text-xs text-gray-500 mt-1 font-medium tracking-wide">
                    {event.timestamp}
                  </p>
                )}
                {event.description && (
                  <p className="text-sm text-gray-400 mt-2 max-w-sm">
                    {event.description}
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
