const Customer = user => ({
  name: user.name,
  email: user.email,
  uid: user.uid,
  phoneNo: user.phoneNo,
  username: user.username,
  profileImage: user.profileImage,
  oAuth: user.oAuth,
  oAuthProvider: user.oAuthProvider,
  lastLoggedIn: user.lastLoggedIn,
  createdAt: user.createdAt,
  isVerified: user.isVerified,
  linkedAccountEmails: user.linkedAccountEmails
});

const Restaurant = rest => ({
  name: rest.name,
  email: rest.email,
  restID: rest._id,
  phoneNo: rest.phoneNo,
  profileImage: rest.profileImage,
  description: rest.description,
  restaurantType: rest.restaurantType,
  restaurantRating: rest.restaurantRating,
  isVerified: rest.isVerified,
  address: rest.address,
  picture: rest.picture,
  cuisine: rest.cuisine,
  tags: rest.tags,
  services: rest.services,
  operatingDays: rest.operatingDays,
  restaurantRating: rest.restaurantRating,
  paymentMode: rest.paymentMode,
  alcohol: rest.alcohol,
  restaurantType: rest.restaurantType
});

const LastOrder = data => ({
  specialInstruction: data.specialInstruction,
  orderID: data._id,
  restID: data.restID,
  custID: data.custID,
  orderItems: data.orderItems,
  createdAt: data.createdAt
});

function NearbyRest(rest) {
  const data = rest.map(rest => {
    temp = {};
    (temp.restID = rest._id),
      (temp.name = rest.name),
      (temp.type = rest.type),
      (temp.cuisine = rest.cuisine),
      (temp.distance = rest.distance),
      (temp.profileImage = rest.profileImage),
      (temp.restaurantRating = rest.restaurantRating),
      (temp.services = rest.services),
      (temp.description = rest.description);
    return temp;
  });
  return data;
}

const Restshort = rest => ({
  restID: rest._id,
  name: rest.name,
  type: rest.type,
  cuisine: rest.cuisine,
  distance: rest.distance,
  profileImage: rest.profileImage,
  restaurantRating: rest.restaurantRating,
  services: rest.services,
  description: rest.description
});

function beenHereRestaurant(element) {
  const data = element.map(rest => {
    temp = {};
    if (rest.restID == null)
      return;
    else {
      const date = (rest.createdAt.getDate() + "-" + rest.createdAt.getMonth() + "-" + rest.createdAt.getFullYear());
      (temp._id = rest._id), (temp.restProfile = Restshort(rest.restID), (temp.date = date));
    }
    return temp;
  });
  return data;
}

function CustomerRating(data) {
  const result = data.map(element => {
    temp = {};
    (temp.reviewHeading = element.reviewHeading),
      (temp.isDeleted = element.isDeleted),
      (temp.restaurantResponse = element.restaurantResponse),
      (temp.restaurantsName = element.restID.name),
      (temp.custID = element.custID),
      (temp.rating = element.rating),
      (temp.description = element.description),
      (temp.date = element.date),
      (temp.createdAt = element.createdAt),
      (temp.updatedAt = element.updatedAt);
    return temp;
  });
  return result;
}

function GetBookMark(data) {
  const result = data.map(element => {
    temp = {
      bookmarkID: element._id,
      custID: element.custID,
      restaurant: Restshort(element.restID),
    };
    return temp;
  })
  return result;
}


module.exports = {
  Customer,
  Restaurant,
  NearbyRest,
  beenHereRestaurant,
  LastOrder,
  CustomerRating,
  GetBookMark,
};
