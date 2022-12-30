import { useState } from 'react';

/**
 * Custom hook to manage the active state
 * @param state - optional initial state
 * @returns {Array} practical functions to manage the active state
 */
const useActive: Function = (state: boolean = false): [Boolean, Function, Function, Function] => {
	const [isActive, setIsActive] = useState<Boolean>(state);

	/**
	 * Function to open drawer content
	 * @returns {void}
	 */
	const open: Function = (): void => setIsActive(true);

	/**
	 * Function to close drawer content
	 * @returns {void}
	 */
	const close: Function = (): void => setIsActive(false);

	/**
	 * Function to open/close drawer content
	 * @returns {void}
	 */
	const toggle: Function = (): void => setIsActive(!isActive);

	return [isActive, open, close, toggle];
};

export default useActive;
