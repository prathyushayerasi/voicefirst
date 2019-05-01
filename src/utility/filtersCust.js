
function categories(data){
    var cuisine = Object.create(null);
    var services = Object.create(null);
    data.forEach(element => {
        element.cuisine.forEach(element=>{
            cuisine[element] = cuisine[element] ? cuisine[element] +1 : 1;
        });
        element.services.forEach(element=>{
            services[element] = services[element] ? services[element] +1 : 1;
        });
    });
    return {
        cuisine,
        services
    };
}

module.exports ={
    categories
}