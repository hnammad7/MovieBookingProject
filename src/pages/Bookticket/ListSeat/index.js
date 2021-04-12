import React from 'react'

import SeatIcon from '@material-ui/icons/CallToActionRounded';
import { useSelector, useDispatch } from 'react-redux';
import Countdown from '../Countdown';

import useStyles from './style'
import { colorTheater, logoTheater } from '../../../constants/theaterData'
import formatDate from '../../../utilities/formatDate'
import { CHANGE_LISTSEAT } from '../../../reducers/constants/BookTicket';

export default function Index({ horizontal }) {
  const { listSeat, danhSachPhongVe } = useSelector(state => state.bookTicket);
  const { thongTinPhim } = danhSachPhongVe
  const classes = useStyles({ color: colorTheater[thongTinPhim?.tenCumRap.slice(0, 3).toUpperCase()], modalLeftImg: thongTinPhim?.hinhAnh, horizontal })
  const dispatch = useDispatch();

  const handleSelectedSeat = (seatSelected) => {
    if (seatSelected.daDat) { // click vào ghế đã có người chọn
      return;
    }
    // đổi lại giá trị selected của ghế đã chọn
    let newListSeat = listSeat.map(seat => {
      if (seatSelected.maGhe === seat.maGhe) {
        return ({ ...seat, selected: !seat.selected })
      }
      return seat
    })
    dispatch({
      type: CHANGE_LISTSEAT,
      payload: {
        listSeat: newListSeat,
        isSelectedSeat: newListSeat.some((seat) => seat.selected)
      }
    })
  }
  const color = (seat) => {
    let color;
    if (seat.loaiGhe === 'Thuong') {
      color = '#3e515d';
    }
    if (seat.loaiGhe === 'Vip') {
      color = '#f7b500'
    }
    if (seat.selected) {
      color = '#44c020'
    }
    if (seat.daDat) {
      color = '#e7eaec'
    }
    return color;
  }

  return (
    <main className={classes.listSeat}>

      {/* thông tin phim */}
      <div className={classes.info_CountDown}>
        <div className={classes.infoTheater}>
          <img src={logoTheater[thongTinPhim?.tenCumRap.slice(0, 3).toUpperCase()]} alt="phim" style={{ width: 50, height: 50 }} />
          <div className={classes.text}>
            <p className={classes.text__first}><span>{thongTinPhim?.tenCumRap.split("-")[0]}</span><span className={classes.text__second}>-{thongTinPhim?.tenCumRap.split("-")[1]}</span></p>
            <p className={classes.textTime}>{`${thongTinPhim && formatDate(thongTinPhim.ngayChieu).dayToday} - ${thongTinPhim?.gioChieu} - ${thongTinPhim?.tenRap}`}</p>
          </div>
        </div>
        <div className={classes.countDown}>
          <p className={classes.timeTitle}>Thời gian giữ ghế</p>
          <Countdown />
        </div>
      </div>

      {/* mô phỏng màn hình */}
      <img className={classes.screen} src="/img/bookticket/screen.png" />

      {/* danh sách ghế */}
      <div className={classes.seatSelect}>
        {listSeat?.map((seat, i) => (
          <div className={classes.seat} key={seat.maGhe}>
            {(i === 0 || (i % 16) === 0) && <p className={classes.label}>{seat.label.slice(0, 1)}</p>}
            {seat.selected && <p className={classes.seatName}>{Number(seat.label.slice(1)) < 10 ? seat.label.slice(2) : seat.label.slice(1)}</p>}
            {seat.daDat && <p className={classes.seatLocked}>x</p>}
            <SeatIcon style={{ color: color(seat) }} className={classes.seatIcon} />
            {seat.label == 'E08' && <img className={classes.viewCenter} src="/img/bookticket/seatcenter.png" alt="seatcenter" />}
            <div className={classes.areaClick} onClick={() => handleSelectedSeat(seat)}></div>
          </div>
        ))}
      </div>

      {/* thông tin các loại ghế */}
      <div className={classes.noteSeat}>
        <div className={classes.typeSeats}>
          <div >
            <SeatIcon style={{ color: '#3e515d', }} />
            <p>Ghế thường</p>
          </div>
          <div >
            <SeatIcon style={{ color: '#f7b500', }} />
            <p>Ghế vip</p>
          </div>
          <div >
            <SeatIcon style={{ color: '#44c020', }} />
            <p>Ghế đang chọn</p>
          </div>
          <div style={{ position: 'relative' }}>
            <p className={classes.posiX} >x</p>
            <SeatIcon style={{ color: '#e7eaec', }} />
            <p>Ghế đã có người chọn</p>
          </div>
        </div>
        <div className={classes.positionView}>
          <span>
            <span className={classes.linecenter} />
            <span>Ghế trung tâm</span>
          </span>
          <span className={classes.line}>
            <span className={classes.linebeautiful} />
            <span>Ghế Đẹp</span>
          </span>
        </div>
      </div>

      {/* modalleft */}
      <div className={classes.modalleft}>
        <div className={classes.opacity}></div>
      </div>
    </main>
  )
}
