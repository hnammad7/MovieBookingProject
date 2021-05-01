import React, { useEffect, useState } from 'react';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import AppBar from '@material-ui/core/AppBar';
import Rating from '@material-ui/lab/Rating';

import { FAKE_AVATAR } from '../../../constants/config';
import useStyles from './style';
import scroll from '../../../utilities/scroll';
import LichChieuDesktop from './LichChieuDesktop';
import LichChieuMobile from './LichChieuMobile';

function TabPanel(props) {
  const { isMobile, children, value, index, ...other } = props;
  return (<div hidden={value !== index}  {...other} >
    <Box p={(isMobile && index === 0) ? 0 : 3}>
      {children}
    </Box>
  </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

export default function CenteredTabs({ data, onClickBtnMuave, isMobile }) {
  const classes = useStyles()
  const [value, setValue] = useState(0)
  const [croll, setCroll] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0) // ngăn window.history.scrollRestoration = 'auto';
    setValue(() => 0)
    setCroll(() => Date.now())
  }, [onClickBtnMuave]) // khi click muave thì mới mở tap 0 > đổi giá trị croll để scroll tới TapMovieDetail

  useEffect(() => {
    if (onClickBtnMuave !== 0) { // không scroll khi mới load topDesktopMovieDetail
      scroll("TapMovieDetail")
    }
  }, [croll]) // khi nhấn muave và đã hoàn thành mở tap 0 thì scroll

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root} id="TapMovieDetail">
      <AppBar position="static" color="default" classes={{ root: classes.appBarRoot }}>
        <Tabs
          value={value}
          onChange={handleChange}
          centered
          classes={{ indicator: classes.indicator }}
        >
          <Tab disableRipple label="Lịch Chiếu" classes={{ selected: classes.selectedTap, root: classes.tapRoot }} />
          <Tab disableRipple label="Nội Dung" classes={{ selected: classes.selectedTap, root: classes.tapRoot }} />
          <Tab disableRipple label="Đánh Giá" classes={{ selected: classes.selectedTap, root: classes.tapRoot }} />
        </Tabs>
      </AppBar>
      <Fade in={value === 0}>
        <TabPanel value={value} index={0} isMobile={isMobile}>
          {isMobile ? <LichChieuMobile data={data} isMobile={isMobile} /> : <LichChieuDesktop data={data} isMobile={isMobile} />}
        </TabPanel>
      </Fade>
      <Fade in={value === 1}>
        <TabPanel value={value} index={1}>
          <div>{data.moTa}</div>
        </TabPanel>
      </Fade>
      <Fade in={value === 2}>
        <TabPanel value={value} index={2}>
          <div className={classes.danhGia}>
            <div className={classes.inputRoot}>
              <span className={classes.avatarReviewer}>
                <img src={FAKE_AVATAR} alt="avatar" className={classes.avatar} />
              </span>
              <input className={classes.inputReviwer} type="text" placeholder="Bạn nghĩ gì về phim này?" readOnly="readonly" />

              <span className={classes.imgReviewerStar}>
                <Rating name="half-rating-read" value={5} readOnly />
              </span>
            </div>
          </div>
        </TabPanel>
      </Fade>
    </div>
  );
}
