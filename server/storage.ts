import { 
  type Location, 
  type Route, 
  type Bus, 
  type Schedule,
  type InsertLocation, 
  type InsertRoute, 
  type InsertBus, 
  type InsertSchedule,
  type RouteWithLocations,
  type LocationWithSubLocations 
} from "@shared/schema";
import { randomUUID } from "crypto";

// Transport system storage interface
export interface IStorage {
  // Location methods
  getLocation(id: string): Promise<Location | undefined>;
  getLocationsByParent(parentId: string | null): Promise<Location[]>;
  createLocation(location: InsertLocation): Promise<Location>;
  
  // Route methods
  getRoute(id: string): Promise<Route | undefined>;
  getRoutesByLocation(locationId: string): Promise<RouteWithLocations[]>;
  createRoute(route: InsertRoute): Promise<Route>;
  
  // Bus methods
  getBus(id: string): Promise<Bus | undefined>;
  getBusesByRoute(routeId: string): Promise<Bus[]>;
  updateBusLocation(id: string, latitude: string, longitude: string): Promise<Bus | undefined>;
  
  // Schedule methods
  getSchedulesByRoute(routeId: string): Promise<Schedule[]>;
  createSchedule(schedule: InsertSchedule): Promise<Schedule>;
}

export class MemStorage implements IStorage {
  private locations: Map<string, Location>;
  private routes: Map<string, Route>;
  private buses: Map<string, Bus>;
  private schedules: Map<string, Schedule>;

  constructor() {
    this.locations = new Map();
    this.routes = new Map();
    this.buses = new Map();
    this.schedules = new Map();
  }

  // Location methods
  async getLocation(id: string): Promise<Location | undefined> {
    return this.locations.get(id);
  }

  async getLocationsByParent(parentId: string | null): Promise<Location[]> {
    return Array.from(this.locations.values()).filter(
      (location) => location.parentLocationId === parentId,
    );
  }

  async createLocation(insertLocation: InsertLocation): Promise<Location> {
    const id = randomUUID();
    const location: Location = { 
      ...insertLocation, 
      id,
      parentLocationId: insertLocation.parentLocationId || null 
    };
    this.locations.set(id, location);
    return location;
  }

  // Route methods
  async getRoute(id: string): Promise<Route | undefined> {
    return this.routes.get(id);
  }

  async getRoutesByLocation(locationId: string): Promise<RouteWithLocations[]> {
    const routes = Array.from(this.routes.values()).filter(
      (route) => route.startLocationId === locationId || route.endLocationId === locationId,
    );
    
    const routesWithLocations: RouteWithLocations[] = [];
    for (const route of routes) {
      const startLocation = this.locations.get(route.startLocationId);
      const endLocation = this.locations.get(route.endLocationId);
      if (startLocation && endLocation) {
        routesWithLocations.push({
          ...route,
          startLocation,
          endLocation
        });
      }
    }
    return routesWithLocations;
  }

  async createRoute(insertRoute: InsertRoute): Promise<Route> {
    const id = randomUUID();
    const route: Route = { ...insertRoute, id };
    this.routes.set(id, route);
    return route;
  }

  // Bus methods
  async getBus(id: string): Promise<Bus | undefined> {
    return this.buses.get(id);
  }

  async getBusesByRoute(routeId: string): Promise<Bus[]> {
    return Array.from(this.buses.values()).filter(
      (bus) => bus.routeId === routeId,
    );
  }

  async updateBusLocation(id: string, latitude: string, longitude: string): Promise<Bus | undefined> {
    const bus = this.buses.get(id);
    if (bus) {
      const updatedBus: Bus = {
        ...bus,
        currentLatitude: latitude,
        currentLongitude: longitude,
        lastUpdated: new Date()
      };
      this.buses.set(id, updatedBus);
      return updatedBus;
    }
    return undefined;
  }

  // Schedule methods
  async getSchedulesByRoute(routeId: string): Promise<Schedule[]> {
    return Array.from(this.schedules.values()).filter(
      (schedule) => schedule.routeId === routeId,
    );
  }

  async createSchedule(insertSchedule: InsertSchedule): Promise<Schedule> {
    const id = randomUUID();
    const schedule: Schedule = { 
      ...insertSchedule, 
      id,
      estimatedArrival: insertSchedule.estimatedArrival || null,
      actualArrival: insertSchedule.actualArrival || null
    };
    this.schedules.set(id, schedule);
    return schedule;
  }
}

export const storage = new MemStorage();
