import { Link } from "react-router-dom"

const BannerBox = (props) => {
  return (
    <div className="box bannerBox">
      <Link to="/">
        <img src={props.img} className="w-full rounded-lg" alt="banner" />
      </Link>
    </div>
  );
};

export default BannerBox;
