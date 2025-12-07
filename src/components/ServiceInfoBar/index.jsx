import { FaTruckMoving, FaPhoneAlt } from "react-icons/fa";
import { MdOutlinePublishedWithChanges } from "react-icons/md";
import { RiMoneyDollarCircleFill } from "react-icons/ri";

const ServiceInfoBar = () => {
  const services = [
    {
      icon: <FaTruckMoving className="text-[26px] text-[#001F5D]" />,
      title: "Miễn phí vận chuyển",
      desc: "Đơn từ 399K",
    },
    {
      icon: (
        <MdOutlinePublishedWithChanges className="text-[26px] text-[#001F5D]" />
      ),
      title: "Đổi hàng tận nhà",
      desc: "Trong vòng 15 ngày",
    },
    {
      icon: <RiMoneyDollarCircleFill className="text-[26px] text-[#001F5D]" />,
      title: "Thanh toán COD",
      desc: "Yên tâm mua sắm",
    },
    {
      icon: <FaPhoneAlt className="text-[24px] text-[#001F5D]" />,
      title: (
        <>
          Hotline: <span className="font-semibold">028.73066.060</span>
        </>
      ),
      desc: "Hỗ trợ bạn từ 8h30–24h00",
    },
  ];

  return (
    <div className="bg-white py-6 px-4 sm:px-10 md:px-16 shadow-sm border-t border-b border-gray-200">
      <div
        className="container mx-auto flex items-center justify-center gap-8 overflow-x-auto 
  thin-scrollbar scroll-smooth touch-pan-x"
      >
        {services.map((service, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center min-w-[200px] sm:min-w-[220px] 
            flex-shrink-0 text-center transition-transform duration-200 hover:scale-[1.05]"
          >
            <div className="w-[50px] h-[50px] flex items-center justify-center rounded-full border border-[#001F5D] mb-2">
              {service.icon}
            </div>
            <h4 className="text-[15px] font-[600] leading-tight">
              {service.title}
            </h4>
            <p className="text-[13px] text-gray-500 leading-tight">
              {service.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceInfoBar;
