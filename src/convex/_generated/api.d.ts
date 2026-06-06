/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as analytics from "../analytics.js";
import type * as analytics_utils_buildUserAnalyticsAccommodationChartData from "../analytics/utils/buildUserAnalyticsAccommodationChartData.js";
import type * as analytics_utils_buildUserAnalyticsAccommodationRows from "../analytics/utils/buildUserAnalyticsAccommodationRows.js";
import type * as analytics_utils_buildUserAnalyticsHospitalitiesChartData from "../analytics/utils/buildUserAnalyticsHospitalitiesChartData.js";
import type * as analytics_utils_buildUserAnalyticsHospitalitiesRows from "../analytics/utils/buildUserAnalyticsHospitalitiesRows.js";
import type * as analytics_utils_computeAnalyticsConversionRate from "../analytics/utils/computeAnalyticsConversionRate.js";
import type * as analytics_utils_formatAnalyticsCount from "../analytics/utils/formatAnalyticsCount.js";
import type * as analytics_utils_formatAnalyticsMetricTrend from "../analytics/utils/formatAnalyticsMetricTrend.js";
import type * as analytics_utils_getAnalyticsMetricValue from "../analytics/utils/getAnalyticsMetricValue.js";
import type * as analytics_utils_sortAnalyticsItemsByMetric from "../analytics/utils/sortAnalyticsItemsByMetric.js";
import type * as analytics_utils_sumAnalyticsMetricTotals from "../analytics/utils/sumAnalyticsMetricTotals.js";
import type * as auth_auth from "../auth/auth.js";
import type * as auth_authRoutes from "../auth/authRoutes.js";
import type * as auth_convexCreateAuthRateLimitHook from "../auth/convexCreateAuthRateLimitHook.js";
import type * as auth_emails_sendVerificationOTP from "../auth/emails/sendVerificationOTP.js";
import type * as auth_guestConvexAuth from "../auth/guestConvexAuth.js";
import type * as auth_helpers_getAuthUserId from "../auth/helpers/getAuthUserId.js";
import type * as auth_middleware_authMiddleware from "../auth/middleware/authMiddleware.js";
import type * as auth_queries_authQueries from "../auth/queries/authQueries.js";
import type * as auth_utils_getEmailFromAuthBody from "../auth/utils/getEmailFromAuthBody.js";
import type * as convexRateLimiter from "../convexRateLimiter.js";
import type * as crons from "../crons.js";
import type * as email_templates_baseEmailTemplate from "../email/templates/baseEmailTemplate.js";
import type * as email_templates_emailFooterTemplate from "../email/templates/emailFooterTemplate.js";
import type * as email_templates_emailHeaderTemplate from "../email/templates/emailHeaderTemplate.js";
import type * as email_utils_convexEmailUtils from "../email/utils/convexEmailUtils.js";
import type * as helpers_convexGetRateLimitedUserId from "../helpers/convexGetRateLimitedUserId.js";
import type * as helpers_createDeleteMutation from "../helpers/createDeleteMutation.js";
import type * as helpers_createSearchQuery from "../helpers/createSearchQuery.js";
import type * as helpers_fetchOptimized from "../helpers/fetchOptimized.js";
import type * as helpers_paginationHelpers from "../helpers/paginationHelpers.js";
import type * as helpers_uniqueIds from "../helpers/uniqueIds.js";
import type * as http from "../http.js";
import type * as pages_userAnalytics_helpers_getTopAccommodationNamesByHospitality from "../pages/userAnalytics/helpers/getTopAccommodationNamesByHospitality.js";
import type * as pages_userAnalytics_helpers_getTopHospitalityNamesByAccommodation from "../pages/userAnalytics/helpers/getTopHospitalityNamesByAccommodation.js";
import type * as pages_userAnalytics_helpers_getUserAnalyticsChartData from "../pages/userAnalytics/helpers/getUserAnalyticsChartData.js";
import type * as pages_userAnalytics_queries_fetchUserAnalyticsAccommodationsPage from "../pages/userAnalytics/queries/fetchUserAnalyticsAccommodationsPage.js";
import type * as pages_userAnalytics_queries_fetchUserAnalyticsGuestActivationsChart from "../pages/userAnalytics/queries/fetchUserAnalyticsGuestActivationsChart.js";
import type * as pages_userAnalytics_queries_fetchUserAnalyticsHospitalitiesPage from "../pages/userAnalytics/queries/fetchUserAnalyticsHospitalitiesPage.js";
import type * as pages_userAnalytics_queries_fetchUserAnalyticsQrScansChart from "../pages/userAnalytics/queries/fetchUserAnalyticsQrScansChart.js";
import type * as pages_userAnalytics_queries_fetchUserAnalyticsReservationsChart from "../pages/userAnalytics/queries/fetchUserAnalyticsReservationsChart.js";
import type * as pages_userAnalytics_queries_fetchUserAnalyticsReservationsPage from "../pages/userAnalytics/queries/fetchUserAnalyticsReservationsPage.js";
import type * as pages_userAnalytics_queries_fetchUserAnalyticsTopAccommodations from "../pages/userAnalytics/queries/fetchUserAnalyticsTopAccommodations.js";
import type * as pages_userAnalytics_queries_fetchUserAnalyticsTopHospitalities from "../pages/userAnalytics/queries/fetchUserAnalyticsTopHospitalities.js";
import type * as pages_userAnalytics_types_userAnalyticsTypes from "../pages/userAnalytics/types/userAnalyticsTypes.js";
import type * as pages_userAnalytics_utils_dateUtils from "../pages/userAnalytics/utils/dateUtils.js";
import type * as pages_userAnalytics_utils_rankingFormatUtils from "../pages/userAnalytics/utils/rankingFormatUtils.js";
import type * as pages_userDashboard_helpers_getUserDashboardPendingReservations from "../pages/userDashboard/helpers/getUserDashboardPendingReservations.js";
import type * as pages_userDashboard_helpers_getUserDashboardStats from "../pages/userDashboard/helpers/getUserDashboardStats.js";
import type * as pages_userDashboard_queries_fetchUserDashboardPendingReservations from "../pages/userDashboard/queries/fetchUserDashboardPendingReservations.js";
import type * as pages_userDashboard_queries_fetchUserDashboardStats from "../pages/userDashboard/queries/fetchUserDashboardStats.js";
import type * as pages_userDashboard_types_userDashboardTypes from "../pages/userDashboard/types/userDashboardTypes.js";
import type * as projectSettings from "../projectSettings.js";
import type * as rateLimits_convexCreateRateLimit from "../rateLimits/convexCreateRateLimit.js";
import type * as rateLimits_convexCreateRateLimitInternal from "../rateLimits/convexCreateRateLimitInternal.js";
import type * as rateLimits_enforceRateLimit from "../rateLimits/enforceRateLimit.js";
import type * as rateLimits_keys from "../rateLimits/keys.js";
import type * as rateLimits_registry from "../rateLimits/registry.js";
import type * as rateLimits_searchRateLimitMutations from "../rateLimits/searchRateLimitMutations.js";
import type * as resend from "../resend.js";
import type * as schemas_mutationResult from "../schemas/mutationResult.js";
import type * as storage_crons_cleanupOrphanDataR2 from "../storage/crons/cleanupOrphanDataR2.js";
import type * as storage_r2_buildR2PublicObjectUrl from "../storage/r2/buildR2PublicObjectUrl.js";
import type * as storage_r2_r2 from "../storage/r2/r2.js";
import type * as storage_r2_resolveStoredFileUrl from "../storage/r2/resolveStoredFileUrl.js";
import type * as storage_r2_uploadedFilesR2 from "../storage/r2/uploadedFilesR2.js";
import type * as storage_registerStorageCrons from "../storage/registerStorageCrons.js";
import type * as tables_accommodations_helpers_allocateScanToken from "../tables/accommodations/helpers/allocateScanToken.js";
import type * as tables_accommodations_helpers_getAccommodationByIdSafe from "../tables/accommodations/helpers/getAccommodationByIdSafe.js";
import type * as tables_accommodations_helpers_getAccommodationByScanTokenSafe from "../tables/accommodations/helpers/getAccommodationByScanTokenSafe.js";
import type * as tables_accommodations_helpers_getAccommodationsByIds from "../tables/accommodations/helpers/getAccommodationsByIds.js";
import type * as tables_accommodations_helpers_getOwnedAccommodation from "../tables/accommodations/helpers/getOwnedAccommodation.js";
import type * as tables_accommodations_helpers_getUserOwnedAccommodationIds from "../tables/accommodations/helpers/getUserOwnedAccommodationIds.js";
import type * as tables_accommodations_helpers_getUserOwnedAccommodations from "../tables/accommodations/helpers/getUserOwnedAccommodations.js";
import type * as tables_accommodations_mutations_createAccommodation from "../tables/accommodations/mutations/createAccommodation.js";
import type * as tables_accommodations_mutations_deleteAccommodations from "../tables/accommodations/mutations/deleteAccommodations.js";
import type * as tables_accommodations_mutations_updateAccommodation from "../tables/accommodations/mutations/updateAccommodation.js";
import type * as tables_accommodations_queries_fetchAccommodationDetails from "../tables/accommodations/queries/fetchAccommodationDetails.js";
import type * as tables_accommodations_queries_fetchAllAccommodations from "../tables/accommodations/queries/fetchAllAccommodations.js";
import type * as tables_accommodations_queries_fetchMyAccommodationForEdit from "../tables/accommodations/queries/fetchMyAccommodationForEdit.js";
import type * as tables_accommodations_queries_fetchMyAccommodations from "../tables/accommodations/queries/fetchMyAccommodations.js";
import type * as tables_accommodations_queries_fetchMyAccommodationsSummary from "../tables/accommodations/queries/fetchMyAccommodationsSummary.js";
import type * as tables_accommodations_types_accommodationsTypes from "../tables/accommodations/types/accommodationsTypes.js";
import type * as tables_accommodations_utils_convexGenerateScanToken from "../tables/accommodations/utils/convexGenerateScanToken.js";
import type * as tables_auditLog_auditLogConfigs from "../tables/auditLog/auditLogConfigs.js";
import type * as tables_auditLog_crons_auditLogCron from "../tables/auditLog/crons/auditLogCron.js";
import type * as tables_auditLog_helpers_auditLogInternal from "../tables/auditLog/helpers/auditLogInternal.js";
import type * as tables_auditLog_helpers_logAudit from "../tables/auditLog/helpers/logAudit.js";
import type * as tables_auditLog_index from "../tables/auditLog/index.js";
import type * as tables_auditLog_queries_auditLogQueries from "../tables/auditLog/queries/auditLogQueries.js";
import type * as tables_auditLog_registerAuditLogCrons from "../tables/auditLog/registerAuditLogCrons.js";
import type * as tables_auditLog_schemas_auditLogSchema from "../tables/auditLog/schemas/auditLogSchema.js";
import type * as tables_auditLog_utils_auditLogUtils from "../tables/auditLog/utils/auditLogUtils.js";
import type * as tables_guests_actions_createGuestConvexAuthToken from "../tables/guests/actions/createGuestConvexAuthToken.js";
import type * as tables_guests_helpers_accommodationHasActiveGuest from "../tables/guests/helpers/accommodationHasActiveGuest.js";
import type * as tables_guests_helpers_getActiveGuestSession from "../tables/guests/helpers/getActiveGuestSession.js";
import type * as tables_guests_helpers_getActiveGuestSessionFromAuth from "../tables/guests/helpers/getActiveGuestSessionFromAuth.js";
import type * as tables_guests_helpers_getGuestSessionsByAccommodationId from "../tables/guests/helpers/getGuestSessionsByAccommodationId.js";
import type * as tables_guests_mutations_createGuest from "../tables/guests/mutations/createGuest.js";
import type * as tables_guests_mutations_createGuestSharingCode from "../tables/guests/mutations/createGuestSharingCode.js";
import type * as tables_guests_mutations_joinGuestBySharingCode from "../tables/guests/mutations/joinGuestBySharingCode.js";
import type * as tables_guests_queries_fetchCurrentGuest from "../tables/guests/queries/fetchCurrentGuest.js";
import type * as tables_guests_queries_fetchGuestConvexJwks from "../tables/guests/queries/fetchGuestConvexJwks.js";
import type * as tables_guests_queries_fetchGuestSessionFromCookie from "../tables/guests/queries/fetchGuestSessionFromCookie.js";
import type * as tables_guests_types_guestsTypes from "../tables/guests/types/guestsTypes.js";
import type * as tables_guests_utils_guestConvexJwt from "../tables/guests/utils/guestConvexJwt.js";
import type * as tables_guests_utils_guestIssuer from "../tables/guests/utils/guestIssuer.js";
import type * as tables_guests_utils_guestSessionToken from "../tables/guests/utils/guestSessionToken.js";
import type * as tables_guests_utils_guestStayCookieCrypto from "../tables/guests/utils/guestStayCookieCrypto.js";
import type * as tables_guests_utils_isGuestStayIdentity from "../tables/guests/utils/isGuestStayIdentity.js";
import type * as tables_hospitalities_helpers_getHospitalitiesByIds from "../tables/hospitalities/helpers/getHospitalitiesByIds.js";
import type * as tables_hospitalities_helpers_getHospitality from "../tables/hospitalities/helpers/getHospitality.js";
import type * as tables_hospitalities_helpers_getOwnedHospitality from "../tables/hospitalities/helpers/getOwnedHospitality.js";
import type * as tables_hospitalities_helpers_getUserOwnedHospitalities from "../tables/hospitalities/helpers/getUserOwnedHospitalities.js";
import type * as tables_hospitalities_mutations_createHospitality from "../tables/hospitalities/mutations/createHospitality.js";
import type * as tables_hospitalities_mutations_deleteHospitalities from "../tables/hospitalities/mutations/deleteHospitalities.js";
import type * as tables_hospitalities_mutations_updateHospitality from "../tables/hospitalities/mutations/updateHospitality.js";
import type * as tables_hospitalities_mutations_viewHospitality from "../tables/hospitalities/mutations/viewHospitality.js";
import type * as tables_hospitalities_queries_fetchAllHospitalities from "../tables/hospitalities/queries/fetchAllHospitalities.js";
import type * as tables_hospitalities_queries_fetchHospitalityDetails from "../tables/hospitalities/queries/fetchHospitalityDetails.js";
import type * as tables_hospitalities_queries_fetchMyHospitalities from "../tables/hospitalities/queries/fetchMyHospitalities.js";
import type * as tables_hospitalities_queries_fetchMyHospitalitiesSummary from "../tables/hospitalities/queries/fetchMyHospitalitiesSummary.js";
import type * as tables_hospitalities_queries_fetchMyHospitalityForEdit from "../tables/hospitalities/queries/fetchMyHospitalityForEdit.js";
import type * as tables_hospitalities_types_hospitalitiesTypes from "../tables/hospitalities/types/hospitalitiesTypes.js";
import type * as tables_partnerships_helpers_getAccommodationPartnerships from "../tables/partnerships/helpers/getAccommodationPartnerships.js";
import type * as tables_partnerships_helpers_getActivePartnershipsByAccommodation from "../tables/partnerships/helpers/getActivePartnershipsByAccommodation.js";
import type * as tables_partnerships_helpers_getActivePartnershipsByHospitality from "../tables/partnerships/helpers/getActivePartnershipsByHospitality.js";
import type * as tables_partnerships_mutations_createPartnership from "../tables/partnerships/mutations/createPartnership.js";
import type * as tables_partnerships_mutations_deletePartnerships from "../tables/partnerships/mutations/deletePartnerships.js";
import type * as tables_partnerships_queries_fetchAccommodationPartnerships from "../tables/partnerships/queries/fetchAccommodationPartnerships.js";
import type * as tables_partnerships_queries_fetchAllPartnerships from "../tables/partnerships/queries/fetchAllPartnerships.js";
import type * as tables_partnerships_types_partnershipsTypes from "../tables/partnerships/types/partnershipsTypes.js";
import type * as tables_reservations_emails_sendReservationEmailToGuest from "../tables/reservations/emails/sendReservationEmailToGuest.js";
import type * as tables_reservations_emails_sendReservationEmailToHospitalityOwner from "../tables/reservations/emails/sendReservationEmailToHospitalityOwner.js";
import type * as tables_reservations_helpers_createFetchReservationsQuery from "../tables/reservations/helpers/createFetchReservationsQuery.js";
import type * as tables_reservations_helpers_getGuestPendingHospitalityReservation from "../tables/reservations/helpers/getGuestPendingHospitalityReservation.js";
import type * as tables_reservations_helpers_getReservations from "../tables/reservations/helpers/getReservations.js";
import type * as tables_reservations_helpers_getReservationsByAccommodations from "../tables/reservations/helpers/getReservationsByAccommodations.js";
import type * as tables_reservations_helpers_groupReservationsByAccommodation from "../tables/reservations/helpers/groupReservationsByAccommodation.js";
import type * as tables_reservations_helpers_groupReservationsByHospitality from "../tables/reservations/helpers/groupReservationsByHospitality.js";
import type * as tables_reservations_mutations_cancelReservation from "../tables/reservations/mutations/cancelReservation.js";
import type * as tables_reservations_mutations_confirmReservation from "../tables/reservations/mutations/confirmReservation.js";
import type * as tables_reservations_mutations_createReservation from "../tables/reservations/mutations/createReservation.js";
import type * as tables_reservations_queries_fetchCancelledReservations from "../tables/reservations/queries/fetchCancelledReservations.js";
import type * as tables_reservations_queries_fetchConfirmedReservations from "../tables/reservations/queries/fetchConfirmedReservations.js";
import type * as tables_reservations_queries_fetchNoShowReservations from "../tables/reservations/queries/fetchNoShowReservations.js";
import type * as tables_reservations_queries_fetchPendingReservations from "../tables/reservations/queries/fetchPendingReservations.js";
import type * as tables_reservations_queries_fetchReservationsSummary from "../tables/reservations/queries/fetchReservationsSummary.js";
import type * as tables_reservations_types_reservationsTypes from "../tables/reservations/types/reservationsTypes.js";
import type * as tables_users_userMutations from "../tables/users/userMutations.js";
import type * as tables_users_userQueries from "../tables/users/userQueries.js";
import type * as types_convexTypes from "../types/convexTypes.js";
import type * as utils_convexValidationUtils from "../utils/convexValidationUtils.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  analytics: typeof analytics;
  "analytics/utils/buildUserAnalyticsAccommodationChartData": typeof analytics_utils_buildUserAnalyticsAccommodationChartData;
  "analytics/utils/buildUserAnalyticsAccommodationRows": typeof analytics_utils_buildUserAnalyticsAccommodationRows;
  "analytics/utils/buildUserAnalyticsHospitalitiesChartData": typeof analytics_utils_buildUserAnalyticsHospitalitiesChartData;
  "analytics/utils/buildUserAnalyticsHospitalitiesRows": typeof analytics_utils_buildUserAnalyticsHospitalitiesRows;
  "analytics/utils/computeAnalyticsConversionRate": typeof analytics_utils_computeAnalyticsConversionRate;
  "analytics/utils/formatAnalyticsCount": typeof analytics_utils_formatAnalyticsCount;
  "analytics/utils/formatAnalyticsMetricTrend": typeof analytics_utils_formatAnalyticsMetricTrend;
  "analytics/utils/getAnalyticsMetricValue": typeof analytics_utils_getAnalyticsMetricValue;
  "analytics/utils/sortAnalyticsItemsByMetric": typeof analytics_utils_sortAnalyticsItemsByMetric;
  "analytics/utils/sumAnalyticsMetricTotals": typeof analytics_utils_sumAnalyticsMetricTotals;
  "auth/auth": typeof auth_auth;
  "auth/authRoutes": typeof auth_authRoutes;
  "auth/convexCreateAuthRateLimitHook": typeof auth_convexCreateAuthRateLimitHook;
  "auth/emails/sendVerificationOTP": typeof auth_emails_sendVerificationOTP;
  "auth/guestConvexAuth": typeof auth_guestConvexAuth;
  "auth/helpers/getAuthUserId": typeof auth_helpers_getAuthUserId;
  "auth/middleware/authMiddleware": typeof auth_middleware_authMiddleware;
  "auth/queries/authQueries": typeof auth_queries_authQueries;
  "auth/utils/getEmailFromAuthBody": typeof auth_utils_getEmailFromAuthBody;
  convexRateLimiter: typeof convexRateLimiter;
  crons: typeof crons;
  "email/templates/baseEmailTemplate": typeof email_templates_baseEmailTemplate;
  "email/templates/emailFooterTemplate": typeof email_templates_emailFooterTemplate;
  "email/templates/emailHeaderTemplate": typeof email_templates_emailHeaderTemplate;
  "email/utils/convexEmailUtils": typeof email_utils_convexEmailUtils;
  "helpers/convexGetRateLimitedUserId": typeof helpers_convexGetRateLimitedUserId;
  "helpers/createDeleteMutation": typeof helpers_createDeleteMutation;
  "helpers/createSearchQuery": typeof helpers_createSearchQuery;
  "helpers/fetchOptimized": typeof helpers_fetchOptimized;
  "helpers/paginationHelpers": typeof helpers_paginationHelpers;
  "helpers/uniqueIds": typeof helpers_uniqueIds;
  http: typeof http;
  "pages/userAnalytics/helpers/getTopAccommodationNamesByHospitality": typeof pages_userAnalytics_helpers_getTopAccommodationNamesByHospitality;
  "pages/userAnalytics/helpers/getTopHospitalityNamesByAccommodation": typeof pages_userAnalytics_helpers_getTopHospitalityNamesByAccommodation;
  "pages/userAnalytics/helpers/getUserAnalyticsChartData": typeof pages_userAnalytics_helpers_getUserAnalyticsChartData;
  "pages/userAnalytics/queries/fetchUserAnalyticsAccommodationsPage": typeof pages_userAnalytics_queries_fetchUserAnalyticsAccommodationsPage;
  "pages/userAnalytics/queries/fetchUserAnalyticsGuestActivationsChart": typeof pages_userAnalytics_queries_fetchUserAnalyticsGuestActivationsChart;
  "pages/userAnalytics/queries/fetchUserAnalyticsHospitalitiesPage": typeof pages_userAnalytics_queries_fetchUserAnalyticsHospitalitiesPage;
  "pages/userAnalytics/queries/fetchUserAnalyticsQrScansChart": typeof pages_userAnalytics_queries_fetchUserAnalyticsQrScansChart;
  "pages/userAnalytics/queries/fetchUserAnalyticsReservationsChart": typeof pages_userAnalytics_queries_fetchUserAnalyticsReservationsChart;
  "pages/userAnalytics/queries/fetchUserAnalyticsReservationsPage": typeof pages_userAnalytics_queries_fetchUserAnalyticsReservationsPage;
  "pages/userAnalytics/queries/fetchUserAnalyticsTopAccommodations": typeof pages_userAnalytics_queries_fetchUserAnalyticsTopAccommodations;
  "pages/userAnalytics/queries/fetchUserAnalyticsTopHospitalities": typeof pages_userAnalytics_queries_fetchUserAnalyticsTopHospitalities;
  "pages/userAnalytics/types/userAnalyticsTypes": typeof pages_userAnalytics_types_userAnalyticsTypes;
  "pages/userAnalytics/utils/dateUtils": typeof pages_userAnalytics_utils_dateUtils;
  "pages/userAnalytics/utils/rankingFormatUtils": typeof pages_userAnalytics_utils_rankingFormatUtils;
  "pages/userDashboard/helpers/getUserDashboardPendingReservations": typeof pages_userDashboard_helpers_getUserDashboardPendingReservations;
  "pages/userDashboard/helpers/getUserDashboardStats": typeof pages_userDashboard_helpers_getUserDashboardStats;
  "pages/userDashboard/queries/fetchUserDashboardPendingReservations": typeof pages_userDashboard_queries_fetchUserDashboardPendingReservations;
  "pages/userDashboard/queries/fetchUserDashboardStats": typeof pages_userDashboard_queries_fetchUserDashboardStats;
  "pages/userDashboard/types/userDashboardTypes": typeof pages_userDashboard_types_userDashboardTypes;
  projectSettings: typeof projectSettings;
  "rateLimits/convexCreateRateLimit": typeof rateLimits_convexCreateRateLimit;
  "rateLimits/convexCreateRateLimitInternal": typeof rateLimits_convexCreateRateLimitInternal;
  "rateLimits/enforceRateLimit": typeof rateLimits_enforceRateLimit;
  "rateLimits/keys": typeof rateLimits_keys;
  "rateLimits/registry": typeof rateLimits_registry;
  "rateLimits/searchRateLimitMutations": typeof rateLimits_searchRateLimitMutations;
  resend: typeof resend;
  "schemas/mutationResult": typeof schemas_mutationResult;
  "storage/crons/cleanupOrphanDataR2": typeof storage_crons_cleanupOrphanDataR2;
  "storage/r2/buildR2PublicObjectUrl": typeof storage_r2_buildR2PublicObjectUrl;
  "storage/r2/r2": typeof storage_r2_r2;
  "storage/r2/resolveStoredFileUrl": typeof storage_r2_resolveStoredFileUrl;
  "storage/r2/uploadedFilesR2": typeof storage_r2_uploadedFilesR2;
  "storage/registerStorageCrons": typeof storage_registerStorageCrons;
  "tables/accommodations/helpers/allocateScanToken": typeof tables_accommodations_helpers_allocateScanToken;
  "tables/accommodations/helpers/getAccommodationByIdSafe": typeof tables_accommodations_helpers_getAccommodationByIdSafe;
  "tables/accommodations/helpers/getAccommodationByScanTokenSafe": typeof tables_accommodations_helpers_getAccommodationByScanTokenSafe;
  "tables/accommodations/helpers/getAccommodationsByIds": typeof tables_accommodations_helpers_getAccommodationsByIds;
  "tables/accommodations/helpers/getOwnedAccommodation": typeof tables_accommodations_helpers_getOwnedAccommodation;
  "tables/accommodations/helpers/getUserOwnedAccommodationIds": typeof tables_accommodations_helpers_getUserOwnedAccommodationIds;
  "tables/accommodations/helpers/getUserOwnedAccommodations": typeof tables_accommodations_helpers_getUserOwnedAccommodations;
  "tables/accommodations/mutations/createAccommodation": typeof tables_accommodations_mutations_createAccommodation;
  "tables/accommodations/mutations/deleteAccommodations": typeof tables_accommodations_mutations_deleteAccommodations;
  "tables/accommodations/mutations/updateAccommodation": typeof tables_accommodations_mutations_updateAccommodation;
  "tables/accommodations/queries/fetchAccommodationDetails": typeof tables_accommodations_queries_fetchAccommodationDetails;
  "tables/accommodations/queries/fetchAllAccommodations": typeof tables_accommodations_queries_fetchAllAccommodations;
  "tables/accommodations/queries/fetchMyAccommodationForEdit": typeof tables_accommodations_queries_fetchMyAccommodationForEdit;
  "tables/accommodations/queries/fetchMyAccommodations": typeof tables_accommodations_queries_fetchMyAccommodations;
  "tables/accommodations/queries/fetchMyAccommodationsSummary": typeof tables_accommodations_queries_fetchMyAccommodationsSummary;
  "tables/accommodations/types/accommodationsTypes": typeof tables_accommodations_types_accommodationsTypes;
  "tables/accommodations/utils/convexGenerateScanToken": typeof tables_accommodations_utils_convexGenerateScanToken;
  "tables/auditLog/auditLogConfigs": typeof tables_auditLog_auditLogConfigs;
  "tables/auditLog/crons/auditLogCron": typeof tables_auditLog_crons_auditLogCron;
  "tables/auditLog/helpers/auditLogInternal": typeof tables_auditLog_helpers_auditLogInternal;
  "tables/auditLog/helpers/logAudit": typeof tables_auditLog_helpers_logAudit;
  "tables/auditLog/index": typeof tables_auditLog_index;
  "tables/auditLog/queries/auditLogQueries": typeof tables_auditLog_queries_auditLogQueries;
  "tables/auditLog/registerAuditLogCrons": typeof tables_auditLog_registerAuditLogCrons;
  "tables/auditLog/schemas/auditLogSchema": typeof tables_auditLog_schemas_auditLogSchema;
  "tables/auditLog/utils/auditLogUtils": typeof tables_auditLog_utils_auditLogUtils;
  "tables/guests/actions/createGuestConvexAuthToken": typeof tables_guests_actions_createGuestConvexAuthToken;
  "tables/guests/helpers/accommodationHasActiveGuest": typeof tables_guests_helpers_accommodationHasActiveGuest;
  "tables/guests/helpers/getActiveGuestSession": typeof tables_guests_helpers_getActiveGuestSession;
  "tables/guests/helpers/getActiveGuestSessionFromAuth": typeof tables_guests_helpers_getActiveGuestSessionFromAuth;
  "tables/guests/helpers/getGuestSessionsByAccommodationId": typeof tables_guests_helpers_getGuestSessionsByAccommodationId;
  "tables/guests/mutations/createGuest": typeof tables_guests_mutations_createGuest;
  "tables/guests/mutations/createGuestSharingCode": typeof tables_guests_mutations_createGuestSharingCode;
  "tables/guests/mutations/joinGuestBySharingCode": typeof tables_guests_mutations_joinGuestBySharingCode;
  "tables/guests/queries/fetchCurrentGuest": typeof tables_guests_queries_fetchCurrentGuest;
  "tables/guests/queries/fetchGuestConvexJwks": typeof tables_guests_queries_fetchGuestConvexJwks;
  "tables/guests/queries/fetchGuestSessionFromCookie": typeof tables_guests_queries_fetchGuestSessionFromCookie;
  "tables/guests/types/guestsTypes": typeof tables_guests_types_guestsTypes;
  "tables/guests/utils/guestConvexJwt": typeof tables_guests_utils_guestConvexJwt;
  "tables/guests/utils/guestIssuer": typeof tables_guests_utils_guestIssuer;
  "tables/guests/utils/guestSessionToken": typeof tables_guests_utils_guestSessionToken;
  "tables/guests/utils/guestStayCookieCrypto": typeof tables_guests_utils_guestStayCookieCrypto;
  "tables/guests/utils/isGuestStayIdentity": typeof tables_guests_utils_isGuestStayIdentity;
  "tables/hospitalities/helpers/getHospitalitiesByIds": typeof tables_hospitalities_helpers_getHospitalitiesByIds;
  "tables/hospitalities/helpers/getHospitality": typeof tables_hospitalities_helpers_getHospitality;
  "tables/hospitalities/helpers/getOwnedHospitality": typeof tables_hospitalities_helpers_getOwnedHospitality;
  "tables/hospitalities/helpers/getUserOwnedHospitalities": typeof tables_hospitalities_helpers_getUserOwnedHospitalities;
  "tables/hospitalities/mutations/createHospitality": typeof tables_hospitalities_mutations_createHospitality;
  "tables/hospitalities/mutations/deleteHospitalities": typeof tables_hospitalities_mutations_deleteHospitalities;
  "tables/hospitalities/mutations/updateHospitality": typeof tables_hospitalities_mutations_updateHospitality;
  "tables/hospitalities/mutations/viewHospitality": typeof tables_hospitalities_mutations_viewHospitality;
  "tables/hospitalities/queries/fetchAllHospitalities": typeof tables_hospitalities_queries_fetchAllHospitalities;
  "tables/hospitalities/queries/fetchHospitalityDetails": typeof tables_hospitalities_queries_fetchHospitalityDetails;
  "tables/hospitalities/queries/fetchMyHospitalities": typeof tables_hospitalities_queries_fetchMyHospitalities;
  "tables/hospitalities/queries/fetchMyHospitalitiesSummary": typeof tables_hospitalities_queries_fetchMyHospitalitiesSummary;
  "tables/hospitalities/queries/fetchMyHospitalityForEdit": typeof tables_hospitalities_queries_fetchMyHospitalityForEdit;
  "tables/hospitalities/types/hospitalitiesTypes": typeof tables_hospitalities_types_hospitalitiesTypes;
  "tables/partnerships/helpers/getAccommodationPartnerships": typeof tables_partnerships_helpers_getAccommodationPartnerships;
  "tables/partnerships/helpers/getActivePartnershipsByAccommodation": typeof tables_partnerships_helpers_getActivePartnershipsByAccommodation;
  "tables/partnerships/helpers/getActivePartnershipsByHospitality": typeof tables_partnerships_helpers_getActivePartnershipsByHospitality;
  "tables/partnerships/mutations/createPartnership": typeof tables_partnerships_mutations_createPartnership;
  "tables/partnerships/mutations/deletePartnerships": typeof tables_partnerships_mutations_deletePartnerships;
  "tables/partnerships/queries/fetchAccommodationPartnerships": typeof tables_partnerships_queries_fetchAccommodationPartnerships;
  "tables/partnerships/queries/fetchAllPartnerships": typeof tables_partnerships_queries_fetchAllPartnerships;
  "tables/partnerships/types/partnershipsTypes": typeof tables_partnerships_types_partnershipsTypes;
  "tables/reservations/emails/sendReservationEmailToGuest": typeof tables_reservations_emails_sendReservationEmailToGuest;
  "tables/reservations/emails/sendReservationEmailToHospitalityOwner": typeof tables_reservations_emails_sendReservationEmailToHospitalityOwner;
  "tables/reservations/helpers/createFetchReservationsQuery": typeof tables_reservations_helpers_createFetchReservationsQuery;
  "tables/reservations/helpers/getGuestPendingHospitalityReservation": typeof tables_reservations_helpers_getGuestPendingHospitalityReservation;
  "tables/reservations/helpers/getReservations": typeof tables_reservations_helpers_getReservations;
  "tables/reservations/helpers/getReservationsByAccommodations": typeof tables_reservations_helpers_getReservationsByAccommodations;
  "tables/reservations/helpers/groupReservationsByAccommodation": typeof tables_reservations_helpers_groupReservationsByAccommodation;
  "tables/reservations/helpers/groupReservationsByHospitality": typeof tables_reservations_helpers_groupReservationsByHospitality;
  "tables/reservations/mutations/cancelReservation": typeof tables_reservations_mutations_cancelReservation;
  "tables/reservations/mutations/confirmReservation": typeof tables_reservations_mutations_confirmReservation;
  "tables/reservations/mutations/createReservation": typeof tables_reservations_mutations_createReservation;
  "tables/reservations/queries/fetchCancelledReservations": typeof tables_reservations_queries_fetchCancelledReservations;
  "tables/reservations/queries/fetchConfirmedReservations": typeof tables_reservations_queries_fetchConfirmedReservations;
  "tables/reservations/queries/fetchNoShowReservations": typeof tables_reservations_queries_fetchNoShowReservations;
  "tables/reservations/queries/fetchPendingReservations": typeof tables_reservations_queries_fetchPendingReservations;
  "tables/reservations/queries/fetchReservationsSummary": typeof tables_reservations_queries_fetchReservationsSummary;
  "tables/reservations/types/reservationsTypes": typeof tables_reservations_types_reservationsTypes;
  "tables/users/userMutations": typeof tables_users_userMutations;
  "tables/users/userQueries": typeof tables_users_userQueries;
  "types/convexTypes": typeof types_convexTypes;
  "utils/convexValidationUtils": typeof utils_convexValidationUtils;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  analytics: import("@piton-/analytics-convex/_generated/component.js").ComponentApi<"analytics">;
  rateLimiter: import("@convex-dev/rate-limiter/_generated/component.js").ComponentApi<"rateLimiter">;
  betterAuth: import("../auth/component/_generated/component.js").ComponentApi<"betterAuth">;
  r2: import("@convex-dev/r2/_generated/component.js").ComponentApi<"r2">;
  resend: import("@convex-dev/resend/_generated/component.js").ComponentApi<"resend">;
};
