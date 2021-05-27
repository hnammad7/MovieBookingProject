import React, { useState } from 'react';
import * as yup from "yup";
import { ErrorMessage, Field, Form, Formik } from 'formik'
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
export default function FormInput({ selectedPhim, onUpdate, onAddMovie }) {
  const [srcImage, setSrcImage] = useState(selectedPhim?.hinhAnh)
  const setThumbnailPreviews = (e) => {
    let file = e.target;
    var reader = new FileReader();
    reader.readAsDataURL(file.files[0]);
    reader.onload = function () {
      setSrcImage(reader.result)
    };
  }

  const movieSchema = yup.object().shape({
    tenPhim: yup.string().required("*Không được bỏ trống!"),
    trailer: yup.string().required("*Không được bỏ trống!").matches(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/, "*Sai link youtube"),
    hinhAnh: yup.string().required("*Chưa chọn hình!"),
    moTa: yup.string().required("*Không được bỏ trống!").min(100, "Mô tả cần 100 ký tự trở lên!"),
    ngayKhoiChieu: yup.string().required("*Chưa chọn ngày!"),
    danhGia: yup.number().required("*Không được bỏ trống!").min(0, "*Điểm đánh giá phải từ 0 đến 10").integer("*Điểm đánh giá phải từ 0 đến 10").max(10, "*Điểm đánh giá phải từ 0 đến 10"),
  })

  const handleSubmit = (movieObj) => {
    let hinhAnh = movieObj.hinhAnh
    movieObj = { ...movieObj, ngayKhoiChieu: new Date(movieObj?.ngayKhoiChieu)?.toLocaleDateString('en-GB') } // backend yêu cầu định dạng: dd/mm/yyyy: input "2021-05-13", output 13/05/2021
    if (selectedPhim.maPhim) {
      onUpdate(movieObj, hinhAnh)
      return
    }
    const newMovieObj = { ...movieObj }
    hinhAnh = srcImage
    delete newMovieObj.maPhim
    delete newMovieObj.biDanh
    delete newMovieObj.danhGia
    onAddMovie(newMovieObj, hinhAnh)
  }

  return (
    <Formik
      initialValues={{
        maPhim: selectedPhim.maPhim,
        tenPhim: selectedPhim.tenPhim,
        biDanh: selectedPhim.biDanh,
        trailer: selectedPhim.trailer,
        hinhAnh: selectedPhim.hinhAnh,
        moTa: selectedPhim.moTa,
        maNhom: 'GP09',
        ngayKhoiChieu: selectedPhim?.ngayKhoiChieu?.slice(0, 10),
        danhGia: selectedPhim.danhGia,
      }}
      validationSchema={movieSchema}
      onSubmit={handleSubmit}
    >{(formikProp) => (
      <Form >
        <div className="form-group">
          <label>Tên phim&nbsp;</label>
          <ErrorMessage name="tenPhim" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="tenPhim" className="form-control" onChange={formikProp.handleChange} />
        </div>
        <div className="form-group">
          <label>Trailer&nbsp;</label>
          <ErrorMessage name="trailer" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="trailer" className="form-control" onChange={formikProp.handleChange} />
        </div>
        <div className="form-group">
          <label>Hình ảnh&nbsp;</label>
          <ErrorMessage name="hinhAnh" render={msg => <span className="text-danger">{msg}</span>} />
          <div className="form-row">
            <div className="col-2">
              {srcImage ? <img src={srcImage} id="image-selected" alt="movie" className="img-fluid rounded" /> : <ImageOutlinedIcon style={{ fontSize: 60 }} />}
            </div>
            <div className="col-10">
              <input type="file" name="hinhAnh" accept=".jpg,.png" className="form-control" onChange={(e) => {
                formikProp.setFieldValue("hinhAnh", e.currentTarget.files[0])
                setThumbnailPreviews(e)
              }} />
            </div>
          </div>
        </div>
        <div className="form-group">
          <label>Mô tả&nbsp;</label>
          <ErrorMessage name="moTa" render={msg => <span className="text-danger">{msg}</span>} />
          <Field as="textarea" name="moTa" className="form-control" onChange={formikProp.handleChange} />
        </div>
        <div className="form-group">
          <label>Ngày khởi chiếu&nbsp;</label>
          <ErrorMessage name="ngayKhoiChieu" render={msg => <span className="text-danger">{msg}</span>} />
          <Field
            type="date"
            name="ngayKhoiChieu"
            className="form-control"
            onChange={formikProp.handleChange}
          />
        </div>
        <div className="form-group" hidden={selectedPhim.maPhim ? false : true}>
          <label>Đánh giá&nbsp;</label>
          <ErrorMessage name="danhGia" render={msg => <span className="text-danger">{msg}</span>} />
          <Field name="danhGia" type="number" className="form-control" onChange={formikProp.handleChange} />
        </div>
        <button type="submit" className="form-control">Submit</button>
      </Form>
    )}</Formik>
  )
}
