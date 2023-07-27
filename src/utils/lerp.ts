const lerp = (current: number, target: number, factor: number) => {
	const res = current * (1 - factor) + target * factor;
	return res;
};
export default lerp;
