// HELPERS
import { createFetchReservationsQuery } from '@/convex/tables/reservations/helpers/createFetchReservationsQuery';

export const fetchNoShowReservations = createFetchReservationsQuery('no_show');
