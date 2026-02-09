import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface Testimonial {
    id: string;
    content: string;
    author: string;
    timestamp: Time;
    rating: bigint;
}
export interface Promotion {
    id: string;
    title: string;
    endDate: Time;
    link: string;
    description: string;
    image: ExternalBlob;
    startDate: Time;
}
export interface ExportData {
    promotions: Array<Promotion>;
    galleryImages: Array<GalleryImage>;
    contactInfo?: ContactInfo;
    seoMeta: Array<[string, SeoMeta]>;
    orders: Array<Order>;
    menuItems: Array<MenuItem>;
    pages: Array<Page>;
    testimonials: Array<Testimonial>;
}
export type Time = bigint;
export interface Order {
    id: string;
    status: string;
    contactInfo: ContactInfo;
    deliveryDetails: string;
    customerPrincipal: string;
    timestamp: Time;
    items: Array<MenuItem>;
    tableBookingDetails: string;
}
export interface MenuItem {
    id: string;
    name: string;
    description: string;
    category: string;
    price: number;
    special: boolean;
}
export interface Page {
    id: string;
    title: string;
    content: string;
    seoMeta: SeoMeta;
    slug: string;
}
export interface SeoMeta {
    title: string;
    description: string;
    keywords: string;
}
export interface GalleryImage {
    id: string;
    blob: ExternalBlob;
    caption: string;
    category: string;
}
export interface ContactInfo {
    hours: string;
    whatsapp: string;
    email: string;
    address: string;
    mapUrl: string;
    phone: string;
}
export interface UserProfile {
    name: string;
    email: string;
    phone: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addGalleryImage(image: GalleryImage): Promise<void>;
    addMenuItem(item: MenuItem): Promise<void>;
    addPage(page: Page): Promise<void>;
    addPromotion(promotion: Promotion): Promise<void>;
    addTestimonial(testimonial: Testimonial): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    exportData(): Promise<ExportData>;
    getAllOrders(): Promise<Array<Order>>;
    getAllPages(): Promise<Array<Page>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getContactInfo(): Promise<ContactInfo | null>;
    getGalleryImages(): Promise<Array<GalleryImage>>;
    getMenuItems(): Promise<Array<MenuItem>>;
    getOrder(id: string): Promise<Order | null>;
    getOrdersByCustomer(customerId: string): Promise<Array<Order>>;
    getPage(id: string): Promise<Page | null>;
    getPromotions(): Promise<Array<Promotion>>;
    getSeoMeta(page: string): Promise<SeoMeta | null>;
    getTestimonials(): Promise<Array<Testimonial>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(order: Order): Promise<void>;
    removeGalleryImage(id: string): Promise<void>;
    removeMenuItem(id: string): Promise<void>;
    removePage(id: string): Promise<void>;
    removePromotion(id: string): Promise<void>;
    removeTestimonial(id: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateContactInfo(info: ContactInfo): Promise<void>;
    updateMenuItem(id: string, item: MenuItem): Promise<void>;
    updateOrderStatus(id: string, status: string): Promise<void>;
    updatePage(id: string, page: Page): Promise<void>;
    updateSeoMeta(page: string, meta: SeoMeta): Promise<void>;
}
