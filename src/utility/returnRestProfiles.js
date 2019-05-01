const restProfile = rest => ({
  name: rest.name,
  email: rest.email,
  uid: rest.uid,
  companyName: rest.companyName,
  username: rest.username,
  phoneNo: rest.phoneNo,
  profileImage: rest.profileImage,
  restaurantType: rest.restaurantType,
  restaurantRating: rest.restaurantRating,
  isVerified: rest.isVerified,
  description: rest.description,
  oAuth: rest.oAuth,
  oAuthProvider: rest.oAuthProvider,
  employees: rest.employees,
  restaurantAddress: rest.restaurantAddress,
  images: rest.images,
  cuisine: rest.cuisine,
  tags: rest.tags,
  alcohol: rest.alcohol,
  services: rest.services,
  packingCharge: rest.packingCharge,
  seating: rest.seating,
  paymentMode: rest.paymentMode,
  panNo: rest.panNo,
  panCopy: rest.panCopy,
  fssaiCertificate: rest.fssaiCertificate,
  gstin: rest.gstin,
  gst: rest.gst,
  ServiceFee: rest.ServiceFee,
  invoiceProof: rest.invoiceProof,
  lastLoggedIn: rest.lastLoggedIn
});


function CustomerRating(data){
  const result = data.map(element=>{
    temp={};
    temp.reviewHeading =element.reviewHeading,
    temp.isDeleted=element.isDeleted,
    temp._id=element._id,
    temp.restaurantResponse= element.restaurantResponse,
    temp.customerName=element.custID.name,
    temp.rating=element.rating,
    temp.description=element.description,
    temp.date=element.date,
    temp.createdAt=element.createdAt,
    temp.updatedAt=element.updatedAt
    return temp;
  });
  return result;
}



module.exports = {
    restProfile,
    CustomerRating
}