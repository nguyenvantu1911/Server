var express = require('express');
var router = express.Router();
const multer  = require('multer');
var mongo = require('mongoose')

const path = require('path');
main().catch(err => console.log(err));
async function main() {
  await mongo.connect('mongodb+srv://nguyentu:tu12345@cluster0.duzoexy.mongodb.net/server');
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
})

// Khởi tạo middleware upload
const upload = multer({ storage: storage })
const Oto = new mongo.Schema({
  maXe: String,
  tenXe: String,
  giaTien: String,
  namSX: String,
  hinhAnh:[String]
});
/* GET home page. */
router.get('/', async function(req, res, next) {
  const Xeoto = mongo.model('Oto', Oto, 'Oto')
  const data =await Xeoto.find({});
  console.log("Data: ", data);
  res.render('index', { title: 'Express',data: data });
});
router.post('/add', upload.array('hinhAnh'), async function (req, res, next) {
  const {maXe, tenXe, giaTien, namSX} = req.body;
  console.log("Log: ", req.files)
  const hinhAnh = req.files.map(file => file.path.replace(/^.*[\\\/]/, ''));
  const Xeoto = mongo.model('Oto', Oto, 'Oto');
  await Xeoto.create({
    maXe: maXe,
    tenXe: tenXe,
    giaTien: giaTien,
    namSX: namSX,
    hinhAnh: hinhAnh
  });
  const data = await Xeoto.find({});
  console.log(data);
  res.render('index', {title: 'Express', data: data});
});
router.get('/delete/:id', async function (req, res, next) {
  const id = req.params.id;
  console.log("Ghi log: ",id);
  const Xeoto = mongo.model('Oto', Oto, 'Oto');
  await Xeoto.deleteOne({
    _id: id,
  });
  res.redirect('/');

});
router.get('/update/:id', async function (req, res, next) {
  const id= req.params.id;
  console.log("Ghi log id update: ",id);
  const Xeoto = mongo.model('Oto', Oto, 'Oto');
  const data  = await Xeoto.findOne({
    _id: id,
  });
  console.log(data);
  const dataa = await Xeoto.find({});
  console.log("Data: ", dataa);
  res.render('index', {title: 'Express',data: dataa, update: data});

});

// router.get('/update/:id', async function (req, res, next) {
//   const id = req.params.id;
//   console.log("Ghi log id1: ",id);
//   const Xeoto = mongo.model('Oto', Oto, 'Oto');
//   const data  = await Xeoto.find({
//     _id: id,
//   });
//   const dataa = await Xeoto.find({});
//   console.log("Dataa: " ,dataa);
//   res.render('index', {title: 'Express',data: dataa, update: data});
//
// });
router.post('/sua/:id', upload.array('hinhAnh'), async function (req, res, next) {
  const id = req.params.id;
  const {maXe, tenXe, giaTien, namSX} = req.body;

  console.log("ID sua : ", id);
  console.log("Log: ", req.files)
  const hinhAnh = req.files.map(file => file.path.replace(/^.*[\\\/]/, ''));
  const Xeoto = mongo.model('Oto', Oto, 'Oto');
  await Xeoto.updateOne({ _id: id }, { $set: {
      maXe: maXe,
      tenXe: tenXe,
      giaTien: giaTien,
      namSX: namSX,
      hinhAnh: hinhAnh
    }});
  const data = await Xeoto.find({});
  console.log(data);
  res.redirect('/');
});

module.exports = router;
