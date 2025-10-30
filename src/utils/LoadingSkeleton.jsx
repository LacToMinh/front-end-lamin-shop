import Skeleton from "@mui/material/Skeleton";

const LoadingSkeleton = ({ count = 5 }) => {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 bg-white p-3 rounded-xl shadow-sm transition-all mt-10"
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height={280}
            animation="wave"
            sx={{ borderRadius: "10px" }}
          />
          <Skeleton variant="text" width="90%" height={20} animation="wave" />
          <Skeleton variant="text" width="70%" height={20} animation="wave" />
        </div>
      ))}
    </>
  );
};


export default LoadingSkeleton;
