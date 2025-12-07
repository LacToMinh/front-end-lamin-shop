// src/components/Header/Navigation/MegaMenu.jsx
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const variants = {
  hidden: { opacity: 0, y: -15, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", stiffness: 330, damping: 30 },
  },
  exit: { opacity: 0, y: -10, filter: "blur(4px)", transition: { duration: 0.15 } },
};

const MegaMenu = ({ isOpen, cats = [], anchorId = "main-navbar", onPanelEnter, onPanelLeave }) => {
  const [top, setTop] = useState(0);

  // Tính vị trí chính xác của panel (dính sát dưới navbar)
  const updatePosition = () => {
    const navbar = document.getElementById(anchorId);
    if (!navbar) return;
    const rect = navbar.getBoundingClientRect();
    setTop(rect.bottom + window.scrollY);
  };

  useEffect(() => {
    updatePosition();
    const handleResize = () => updatePosition();
    const handleScroll = () => updatePosition();
    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [anchorId]);

  // Escape để đóng
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === "Escape" && onPanelLeave?.();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onPanelLeave]);

  if (!isOpen) return null;

  const panel = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* HOVER BRIDGE SIÊU TO - 60px để tha hồ di chuột chậm */}
          <div
            className="fixed inset-x-0 z-[9998] bg-transparent"
            style={{ top: top - 1, height: 60 }}
            onMouseEnter={onPanelEnter}
          />

          {/* MAIN PANEL */}
          <motion.div
            id="mega-menu-panel"
            variants={variants}
            initial="hidden"
            animate="show"
            exit="exit"
            onMouseEnter={onPanelEnter}
            onMouseLeave={onPanelLeave}
            className="fixed inset-x-0 z-[9999] mx-auto 
           w-[min(94vw,1200px)]
           rounded-none
           bg-white/70 backdrop-blur-2xl 
           border border-white/30 
           shadow-xl 
           p-8 max-h-[78vh] overflow-y-auto"

            style={{ top }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {/* 4 cột danh mục chính */}
              {cats.slice(0, 4).map((parent) => (
                <div key={parent._id}>
                  <h3 className="font-bold text-lg mb-4 text-gray-900">{parent.name}</h3>
                  <ul className="space-y-3">
                    {parent.children?.map((child) => (
                      <li key={child._id}>
                        <Link
                          to={`/productListing?subCatId=${child._id}`}
                          className="font-medium text-gray-700 hover:text-[#001F5D] transition-colors py-1 block"
                          onMouseEnter={onPanelEnter}
                        >
                          {child.name}
                        </Link>

                        {child.children?.length > 0 && (
                          <ul className="mt-2 pl-4 space-y-2 border-l-2" style={{ borderColor: "#F2C94C" }}>

                            {child.children.map((lv3) => (
                              <li key={lv3._id}>
                                <Link
                                  to={`/productListing?thirdSubCatId=${lv3._id}`}
                                  className="text-gray-600 hover:text-[#001F5D] text-sm transition-colors py-0.5 block"
                                  onMouseEnter={onPanelEnter}
                                >
                                  {lv3.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {/* Cột hình ảnh (desktop only) */}
              <div className="hidden lg:block space-y-6">
                <div className="group cursor-pointer overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src="https://res.cloudinary.com/diwj0b37p/image/upload/v1763427540/1763427533695_retro_sport.png"
                    alt="Retro Sports"
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <p className="font-bold text-sm mt-3">Retro Sports</p>
                </div>
                <div className="group cursor-pointer overflow-hidden rounded-2xl shadow-lg">
                  <img
                    src="https://res.cloudinary.com/diwj0b37p/image/upload/v1758799062/1758799059364_banner_banner_slider_3.jpg"
                    alt="Đồ thu đông"
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <p className="font-bold text-sm mt-3">Đồ Thu Đông 2025</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(panel, document.body);
};

export default MegaMenu;