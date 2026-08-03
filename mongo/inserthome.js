const { default: mongoose } = require("mongoose");
const { clothingModel } = require("./home");

async function insertData(){
    // await clothingModel.deleteMany({});


await clothingModel.insertMany([

{
ownerId: new mongoose.Types.ObjectId("6a5e2e9552b88deaf97b32b2"),
ownerName: "Vikki",
title:"Blue jeans ",
brand:"Levi's",
category:"Men",
size:"M",
condition:"Excellent",
swapValue:900,
location:"Bhatkala",
image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTw8y_zFxK3PQd9VCohNAc-L_9_P4uAPDHlpRk8MntTZw&s=10"
},

{
ownerId : new mongoose.Types.ObjectId("6a62f800976b756509cc9a66"),
ownerName : "Rahul" ,
title:"One piece",
brand:"niva",
category:"Women",
size:"L",
condition:"Good",
swapValue:700,
location:"Udupi",
image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7E4RwXIoBE64-oLGRP1A1BAaIV7TKanW3RRuqpeAnQQ&s=10"
},

{
ownerId : new mongoose.Types.ObjectId("6a62f82f976b756509cc9a67"),
ownerName : "Vikas" ,  
title:"Shirt",
brand:"CottonKing",
category:"Men",
size:"M",
condition:" New",
swapValue:1000,
location:"Manipal",
image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5yD7haOKtF6G8AyjqKdOfxE5VTHjUXS3S5Ax0AZsPXw&s=10"
},

{
ownerId : new mongoose.Types.ObjectId("6a62f851976b756509cc9a68"),
ownerName : "Kabir" ,
title:"half Kurti",
brand:"Biba",
category:"Women",
size:"M",
condition:"Excellent",
swapValue:650,
location:"padubidri",
image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKqvhbf1eP8c6HS8-Csy7B1xu1FKjbgoAVpVI0aLvfRw&s=10"
}

]);

console.log("inserted sucessfully");

process.exit();

}

insertData();