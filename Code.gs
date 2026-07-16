const SPREADSHEET_ID="1vjy5Co5ReLrfMRGKhuXUqpdB7dLqxJGSGehqpZ4UI-I";
function res(data){
const s=JSON.stringify(data);
const out=ContentService.createTextOutput(s);
const mime=ContentService.MimeType.JSON;
return out.setMimeType(mime);
}
function doGet(e){
const sheet=SpreadsheetApp.openById(SPREADSHEET_ID);
const action=e.parameter.action;
if(action==="getProducts"){
const s=sheet.getSheetByName("products");
const rows=s.getDataRange().getValues();
const keys=rows[0];
const list=[];
for(let i=1;i<rows.length;i++){
let obj={};
for(let j=0;j<keys.length;j++){obj[keys[j]]=rows[i][j];}
list.push(obj);
}
return res(list);
}
}
function doPost(e){
const sheet=SpreadsheetApp.openById(SPREADSHEET_ID);
const post=JSON.parse(e.postData.contents);
const action=post.action;
if(action==="register"){
const uSheet=sheet.getSheetByName("users");
const data=uSheet.getDataRange().getValues();
const inputPhone=post.phone.toString().trim();
const inputEmail=(post.email||"").toString().trim().toLowerCase();
const inputPass=post.password.toString().trim();
if(inputPass.length<6){return res({success:false,message:"পাসওয়ার্ড অবশ্যই কমপক্ষে ৬ অক্ষরের হতে হবে!"});}
for(let i=1;i<data.length;i++){
let sheetPhone=data[i][2].toString().trim();
let sheetEmail=data[i][3].toString().trim().toLowerCase();
if(!sheetPhone.startsWith("0")&&inputPhone.startsWith("0")){sheetPhone="0"+sheetPhone;}
if(sheetPhone===inputPhone){return res({success:false,message:"এই মোবাইল নাম্বার দিয়ে ইতিমধ্যে অ্যাকাউন্ট তৈরি করা আছে!"});}
if(inputEmail!==""&&sheetEmail===inputEmail){return res({success:false,message:"এই ইমেইল দিয়ে ইতিমধ্যে অ্যাকাউন্ট তৈরি করা আছে!"});}
}
const uId="SACAR-USR-"+Math.floor(1000+Math.random()*9000);
const row=[uId,post.name,"'"+inputPhone,post.email||"","","'"+inputPass,0];
uSheet.appendRow(row);
return res({success:true,userId:uId});
}
if(action==="login"){
const uSheet=sheet.getSheetByName("users");
const data=uSheet.getDataRange().getValues();
const inputPhone=post.phone.toString().trim();
const inputPass=post.password.toString().trim();
for(let i=1;i<data.length;i++){
let sheetPhone=data[i][2].toString().trim();
if(!sheetPhone.startsWith("0")&&inputPhone.startsWith("0")){sheetPhone="0"+sheetPhone;}
const sheetPass=data[i][5].toString().trim();
if(sheetPhone===inputPhone&&sheetPass===inputPass){
return res({success:true,user:{userId:data[i][0],name:data[i][1],phone:sheetPhone,email:data[i][3],address:data[i][4],points:data[i][6]}});
}
}
return res({success:false,message:"ভুল মোবাইল নাম্বার অথবা পাসওয়ার্ড!"});
}
if(action==="placeOrder"){
const oSheet=sheet.getSheetByName("orders");
const row=[post.orderId,post.dateTime,post.customerName,post.customerPhone,post.address,post.itemsDetails,post.deliveryCharge,post.grandTotal,"Pending"];
oSheet.appendRow(row);
if(post.customerPhone){
const uSheet=sheet.getSheetByName("users");
const uData=uSheet.getDataRange().getValues();
const inputPhone=post.customerPhone.toString().trim();
for(let i=1;i<uData.length;i++){
let sheetPhone=uData[i][2].toString().trim();
if(!sheetPhone.startsWith("0")&&inputPhone.startsWith("0")){sheetPhone="0"+sheetPhone;}
if(sheetPhone===inputPhone){
if(post.address){uSheet.getRange(i+1,5).setValue(post.address);}
if(post.earnedPoints>0){
const cur=parseInt(uData[i][6])||0;
const newPts=cur+parseInt(post.earnedPoints);
uSheet.getRange(i+1,7).setValue(newPts);
}
break;
}
}
}
return res({success:true});
}
if(action==="updateProfile"){
const uSheet=sheet.getSheetByName("users");
const uData=uSheet.getDataRange().getValues();
const inputPhone=post.phone.toString().trim();
for(let i=1;i<uData.length;i++){
let sheetPhone=uData[i][2].toString().trim();
if(!sheetPhone.startsWith("0")&&inputPhone.startsWith("0")){sheetPhone="0"+sheetPhone;}
if(sheetPhone===inputPhone){
if(post.name)uSheet.getRange(i+1,2).setValue(post.name);
if(post.email)uSheet.getRange(i+1,4).setValue(post.email);
if(post.address)uSheet.getRange(i+1,5).setValue(post.address);
return res({success:true,message:"প্রোফাইল সফলভাবে আপডেট করা হয়েছে!"});
}
}
return res({success:false,message:"ইউজার পাওয়া যায়নি!"});
}
if(action==="changePassword"){
const uSheet=sheet.getSheetByName("users");
const uData=uSheet.getDataRange().getValues();
const inputPhone=post.phone.toString().trim();
const oldPass=post.oldPassword.toString().trim();
const newPass=post.newPassword.toString().trim();
for(let i=1;i<uData.length;i++){
let sheetPhone=uData[i][2].toString().trim();
if(!sheetPhone.startsWith("0")&&inputPhone.startsWith("0")){sheetPhone="0"+sheetPhone;}
const sheetPass=uData[i][5].toString().trim();
if(sheetPhone===inputPhone){
if(sheetPass===oldPass){
uSheet.getRange(i+1,6).setValue("'"+newPass);
return res({success:true,message:"পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!"});
}else{return res({success:false,message:"বর্তমান পাসওয়ার্ডটি সঠিক নয়!"});}
}
}
return res({success:false,message:"ইউজার খুঁজে পাওয়া যায়নি!"});
}
}
