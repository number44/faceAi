const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
	return Math.hypot(x1 - x2, y1 - y2);
};
export default calculateDistance;
