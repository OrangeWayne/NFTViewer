import { useRef, useEffect, useState } from "react";
import _ from "lodash";

const useScrollBottom = (offset = 250, useWindow = true) => {
	const [isBottom, setIsBottom] = useState(false);

	const scrollRef = useRef(null);
	const { current } = scrollRef;

	const onScroll = _.throttle(() => {
		if (current) {
			const { scrollY, innerHeight } = window;
			const { scrollTop, scrollHeight, clientHeight, offsetTop } =
				current;

			if (useWindow) {
				setIsBottom(
					scrollY + innerHeight + offset >= clientHeight + offsetTop
				);
				return;
			}

			setIsBottom(scrollTop + offset >= scrollHeight - clientHeight);
		}
	}, 200);

	useEffect(() => {
		if (useWindow) {
			window.addEventListener("scroll", onScroll);
		} else if (current) {
			current.addEventListener("scroll", onScroll);
		}

		return () => {
			if (useWindow) {
				window.removeEventListener("scroll", onScroll);
			} else if (current) {
				current.removeEventListener("scroll", onScroll);
			}
		};
	}, [current]);

	return [isBottom, scrollRef];
};

export default useScrollBottom;
