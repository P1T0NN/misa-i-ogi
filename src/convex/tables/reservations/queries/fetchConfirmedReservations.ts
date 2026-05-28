// HELPERS
import { createFetchReservationsQuery } from '@/convex/tables/reservations/helpers/createFetchReservationsQuery';

export const fetchConfirmedReservations = createFetchReservationsQuery('confirmed');
