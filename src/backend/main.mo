import List "mo:core/List";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Set "mo:core/Set";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import AccessControl "authorization/access-control";
import Migration "migration";

(with migration = Migration.run)
actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  let adminPrincipals = Set.empty<Text>();

  public type UserProfile = {
    name : Text;
    email : Text;
    phone : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type MenuItem = {
    id : Text;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    special : Bool;
  };

  let menuItems = Map.empty<Text, MenuItem>();

  public shared ({ caller }) func addMenuItem(item : MenuItem) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add menu items");
    };

    menuItems.add(item.id, item);
  };

  public shared ({ caller }) func updateMenuItem(id : Text, item : MenuItem) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update menu items");
    };

    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };

    menuItems.add(id, item);
  };

  public shared ({ caller }) func removeMenuItem(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove menu items");
    };

    if (not menuItems.containsKey(id)) {
      Runtime.trap("Menu item not found");
    };

    menuItems.remove(id);
  };

  public query func getMenuItems() : async [MenuItem] {
    menuItems.values().toArray();
  };

  type GalleryImage = {
    id : Text;
    blob : Storage.ExternalBlob;
    caption : Text;
    category : Text;
  };

  let galleryImages = List.empty<GalleryImage>();

  public shared ({ caller }) func addGalleryImage(image : GalleryImage) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add gallery images");
    };

    galleryImages.add(image);
  };

  public shared ({ caller }) func removeGalleryImage(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove gallery images");
    };

    let newImages = galleryImages.filter(
      func(img) {
        img.id != id;
      }
    );

    galleryImages.clear();
    galleryImages.addAll(newImages.values());
  };

  public query func getGalleryImages() : async [GalleryImage] {
    galleryImages.toArray();
  };

  type ContactInfo = {
    address : Text;
    phone : Text;
    whatsapp : Text;
    email : Text;
    hours : Text;
    mapUrl : Text;
  };

  var contactInfo : ?ContactInfo = null;

  public shared ({ caller }) func updateContactInfo(info : ContactInfo) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update contact info");
    };

    contactInfo := ?info;
  };

  public query func getContactInfo() : async ?ContactInfo {
    contactInfo;
  };

  type Order = {
    id : Text;
    customerPrincipal : Text;
    items : [MenuItem];
    deliveryDetails : Text;
    tableBookingDetails : Text;
    timestamp : Time.Time;
    status : Text;
    contactInfo : ContactInfo;
  };

  let orders = Map.empty<Text, Order>();

  public shared ({ caller }) func placeOrder(order : Order) : async () {
    // No authorization check - anonymous orders are allowed
    orders.add(order.id, order);
  };

  public shared ({ caller }) func updateOrderStatus(id : Text, status : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?existingOrder) {
        let updatedOrder = { existingOrder with status };
        orders.add(id, updatedOrder);
      };
    };
  };

  public query ({ caller }) func getOrder(id : Text) : async ?Order {
    switch (orders.get(id)) {
      case (null) { null };
      case (?order) {
        // Allow access if: admin OR the order belongs to the caller
        let callerText = caller.toText();
        if (AccessControl.isAdmin(accessControlState, caller) or order.customerPrincipal == callerText) {
          ?order;
        } else {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
      };
    };
  };

  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all orders");
    };
    orders.values().toArray();
  };

  public query ({ caller }) func getOrdersByCustomer(customerId : Text) : async [Order] {
    let callerText = caller.toText();
    // Allow access if: admin OR requesting own orders
    if (not (AccessControl.isAdmin(accessControlState, caller) or callerText == customerId)) {
      Runtime.trap("Unauthorized: Can only view your own orders");
    };

    let customerOrders = orders.values().filter(
      func(order : Order) : Bool {
        order.customerPrincipal == customerId;
      }
    );
    customerOrders.toArray();
  };

  type SeoMeta = {
    title : Text;
    description : Text;
    keywords : Text;
  };

  let seoMeta = Map.empty<Text, SeoMeta>();

  public shared ({ caller }) func updateSeoMeta(page : Text, meta : SeoMeta) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update SEO meta");
    };

    seoMeta.add(page, meta);
  };

  public query func getSeoMeta(page : Text) : async ?SeoMeta {
    seoMeta.get(page);
  };

  type Testimonial = {
    id : Text;
    author : Text;
    content : Text;
    rating : Int;
    timestamp : Time.Time;
  };

  let testimonials = Map.empty<Text, Testimonial>();

  public shared ({ caller }) func addTestimonial(testimonial : Testimonial) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add testimonials");
    };

    testimonials.add(testimonial.id, testimonial);
  };

  public shared ({ caller }) func removeTestimonial(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove testimonials");
    };

    testimonials.remove(id);
  };

  public query func getTestimonials() : async [Testimonial] {
    testimonials.values().toArray();
  };

  type Promotion = {
    id : Text;
    title : Text;
    description : Text;
    image : Storage.ExternalBlob;
    link : Text;
    startDate : Time.Time;
    endDate : Time.Time;
  };

  let promotions = Map.empty<Text, Promotion>();

  public shared ({ caller }) func addPromotion(promotion : Promotion) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add promotions");
    };

    promotions.add(promotion.id, promotion);
  };

  public shared ({ caller }) func removePromotion(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove promotions");
    };

    promotions.remove(id);
  };

  public query func getPromotions() : async [Promotion] {
    promotions.values().toArray();
  };

  type ExportData = {
    menuItems : [MenuItem];
    galleryImages : [GalleryImage];
    contactInfo : ?ContactInfo;
    orders : [Order];
    seoMeta : [(Text, SeoMeta)];
    testimonials : [Testimonial];
    promotions : [Promotion];
    pages : [Page];
  };

  public shared ({ caller }) func exportData() : async ExportData {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can export data");
    };

    {
      menuItems = menuItems.values().toArray();
      galleryImages = galleryImages.toArray();
      contactInfo;
      orders = orders.values().toArray();
      seoMeta = seoMeta.toArray();
      testimonials = testimonials.values().toArray();
      promotions = promotions.values().toArray();
      pages = pages.values().toArray();
    };
  };

  type Page = {
    id : Text;
    title : Text;
    slug : Text;
    content : Text;
    seoMeta : SeoMeta;
  };

  let pages = Map.empty<Text, Page>();

  public shared ({ caller }) func addPage(page : Page) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can add pages");
    };

    pages.add(page.id, page);
  };

  public shared ({ caller }) func updatePage(id : Text, page : Page) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can update pages");
    };

    if (not pages.containsKey(id)) {
      Runtime.trap("Page not found");
    };

    pages.add(id, page);
  };

  public shared ({ caller }) func removePage(id : Text) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can remove pages");
    };

    if (not pages.containsKey(id)) {
      Runtime.trap("Page not found");
    };

    pages.remove(id);
  };

  public query func getPage(id : Text) : async ?Page {
    pages.get(id);
  };

  public query func getAllPages() : async [Page] {
    pages.values().toArray();
  };
};
