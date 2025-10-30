import React from "react";
import { LiaShippingFastSolid } from "react-icons/lia";
import { PiKeyReturn } from "react-icons/pi";
import { RiSecurePaymentFill } from "react-icons/ri";
import { AiOutlineGift } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { IoChatboxOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="py-10 border-t-[1px]">
      <div className="container">
        <div className="flex items-center justify-center gap-4 py-8 pb-20 border-b-[1px]">
          <div className="col flex items-center justify-center flex-col group w-[15%]">
            <LiaShippingFastSolid className="text-[50px] mb-3 transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-2" />
            <h3 className="text-[18px] font-semibold">Free Shipping</h3>
            <p className="text-[13px] font-normal">For all Orders Over 100$</p>
          </div>
          <div className="col flex items-center justify-center flex-col group w-[15%]">
            <PiKeyReturn className="text-[50px] mb-3 transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-2" />
            <h3 className="text-[18px] font-semibold">30 Days Returns</h3>
            <p className="text-[13px] font-normal">For an Exchange Product</p>
          </div>
          <div className="col flex items-center justify-center flex-col group w-[15%]">
            <RiSecurePaymentFill className="text-[50px] mb-3 transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-2" />
            <h3 className="text-[18px] font-semibold">Secured Payment</h3>
            <p className="text-[13px] font-normal">Payment Cards Accepted</p>
          </div>
          <div className="col flex items-center justify-center flex-col group w-[15%]">
            <AiOutlineGift className="text-[50px] mb-3 transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-2" />
            <h3 className="text-[18px] font-semibold">Special Gifts</h3>
            <p className="text-[13px] font-normal">Our First Product Order</p>
          </div>
          <div className="col flex items-center justify-center flex-col group w-[15%]">
            <BiSupport className="text-[50px] mb-3 transition-all duration-300 group-hover:text-[#ff5252] group-hover:-translate-y-2" />
            <h3 className="text-[18px] font-semibold">Support</h3>
            <p className="text-[13px] font-normal">Contact us Anytime</p>
          </div>
        </div>

        <div className="footer py-8 flex items-center">
          <div className="part1 w-[25%] border-r border-black">
            <h2 className="text-[20px] font-semibold">Contact us</h2>
            <p>Icondenim - Mega Super Store</p>
            <Link to="mailto:someone@example.com" className="link">
              sales@yourcompany.com
            </Link>
            <span className="text-[25px] font-600 w-full block mt-3">
              (+91) 9876-543-210
            </span>
            <div className="flex items-center gap-3 mt-3">
              <IoChatboxOutline className="text-[40px]" />
              <span className="font-medium text-[18px] leading-tight">
                Online Chat <br />
                Get Expert Help
              </span>
            </div>
          </div>

          <div className="part2 w-[40%] flex items-center">
            <div className="part2-col1 w-[50%] pl-6">
              <h2 className="text-[20px] font-[600] mb-4">Products</h2>
              <ul className="list">
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    Delivery
                  </Link>
                </li>
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    New Product
                  </Link>
                </li>
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    Best Sales
                  </Link>
                </li>
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    Contact us
                  </Link>
                </li>
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    Sitemap
                  </Link>
                </li>
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    Store
                  </Link>
                </li>
              </ul>
            </div>
            <div className="part2-col2 w-[50%]">
              <h2 className="text-[20px] font-[600] mb-4">Our company</h2>
              <ul className="list">
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    Delivery
                  </Link>
                </li>
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    New Product
                  </Link>
                </li>
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    Best Sales
                  </Link>
                </li>
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    Contact us
                  </Link>
                </li>
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    Sitemap
                  </Link>
                </li>
                <li className="list-none text-[14px] w-full mb-2">
                  <Link to="/" className="link">
                    Store
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
