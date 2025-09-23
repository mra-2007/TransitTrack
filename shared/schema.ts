import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Transport system schema for Sparta
export const locations = pgTable("locations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  type: text("type").notNull(), // 'city' | 'bus_stop' | 'landmark'
  parentLocationId: varchar("parent_location_id"),
});

export const routes = pgTable("routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  startLocationId: varchar("start_location_id").notNull().references(() => locations.id),
  endLocationId: varchar("end_location_id").notNull().references(() => locations.id),
  busType: text("bus_type").notNull(), // 'Ordinary' | 'Deluxe'
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
});

export const buses = pgTable("buses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").notNull().references(() => routes.id),
  busNumber: text("bus_number").notNull(),
  currentLatitude: text("current_latitude"),
  currentLongitude: text("current_longitude"),
  status: text("status").notNull(), // 'active' | 'inactive' | 'maintenance'
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const schedules = pgTable("schedules", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  routeId: varchar("route_id").notNull().references(() => routes.id),
  departureTime: text("departure_time").notNull(),
  estimatedArrival: text("estimated_arrival"),
  actualArrival: text("actual_arrival"),
  status: text("status").notNull(), // 'scheduled' | 'delayed' | 'arrived' | 'cancelled'
});

// Insert schemas
export const insertLocationSchema = createInsertSchema(locations);
export const insertRouteSchema = createInsertSchema(routes);
export const insertBusSchema = createInsertSchema(buses);
export const insertScheduleSchema = createInsertSchema(schedules);

// Types
export type Location = typeof locations.$inferSelect;
export type Route = typeof routes.$inferSelect;
export type Bus = typeof buses.$inferSelect;
export type Schedule = typeof schedules.$inferSelect;

export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type InsertRoute = z.infer<typeof insertRouteSchema>;
export type InsertBus = z.infer<typeof insertBusSchema>;
export type InsertSchedule = z.infer<typeof insertScheduleSchema>;

// Extended types for UI
export type RouteWithLocations = Route & {
  startLocation: Location;
  endLocation: Location;
};

export type LocationWithSubLocations = Location & {
  subLocations: Location[];
};
