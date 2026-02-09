import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Storage "blob-storage/Storage";

module {
  type MenuItem = {
    id : Text;
    name : Text;
    description : Text;
    price : Float;
    category : Text;
    special : Bool;
  };

  type GalleryImage = {
    id : Text;
    blob : Storage.ExternalBlob;
    caption : Text;
    category : Text;
  };

  type ContactInfo = {
    address : Text;
    phone : Text;
    whatsapp : Text;
    email : Text;
    hours : Text;
    mapUrl : Text;
  };

  type SeoMeta = {
    title : Text;
    description : Text;
    keywords : Text;
  };

  type Testimonial = {
    id : Text;
    author : Text;
    content : Text;
    rating : Int;
    timestamp : Time.Time;
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

  type Page = {
    id : Text;
    title : Text;
    slug : Text;
    content : Text;
    seoMeta : SeoMeta;
  };

  type OldOrder = {
    id : Text;
    customerPrincipal : Principal;
    items : [MenuItem];
    deliveryDetails : Text;
    tableBookingDetails : Text;
    timestamp : Time.Time;
    status : Text;
  };

  type NewOrder = {
    id : Text;
    customerPrincipal : Text;
    items : [MenuItem];
    deliveryDetails : Text;
    tableBookingDetails : Text;
    timestamp : Time.Time;
    status : Text;
    contactInfo : ContactInfo;
  };

  type OldActor = {
    menuItems : Map.Map<Text, MenuItem>;
    galleryImages : List.List<GalleryImage>;
    contactInfo : ?ContactInfo;
    orders : Map.Map<Text, OldOrder>;
    seoMeta : Map.Map<Text, SeoMeta>;
    testimonials : Map.Map<Text, Testimonial>;
    promotions : Map.Map<Text, Promotion>;
    pages : Map.Map<Text, Page>;
  };

  type NewActor = {
    menuItems : Map.Map<Text, MenuItem>;
    galleryImages : List.List<GalleryImage>;
    contactInfo : ?ContactInfo;
    orders : Map.Map<Text, NewOrder>;
    seoMeta : Map.Map<Text, SeoMeta>;
    testimonials : Map.Map<Text, Testimonial>;
    promotions : Map.Map<Text, Promotion>;
    pages : Map.Map<Text, Page>;
  };

  public func run(old : OldActor) : NewActor {
    let newOrders = old.orders.map<Text, OldOrder, NewOrder>(
      func(_id, oldOrder) {
        {
          oldOrder with
          customerPrincipal = oldOrder.customerPrincipal.toText();
          contactInfo = {
            address = "";
            phone = "";
            whatsapp = "";
            email = "";
            hours = "";
            mapUrl = "";
          };
        };
      }
    );

    {
      old with
      orders = newOrders;
    };
  };
};
