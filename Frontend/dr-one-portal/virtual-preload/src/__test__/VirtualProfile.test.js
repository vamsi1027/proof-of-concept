import React from 'react';
import { act } from 'react-dom/test-utils';
import "@testing-library/jest-dom/extend-expect"
import { render, screen, fireEvent, waitFor, waitForOptions } from '@testing-library/react';
import { GlobalProvider } from "../context/globalState";
import { I18nextProvider } from "react-i18next";
import { internationalization } from "@dr-one/utils";
import PreloadProfile from '../pages/VirtualPreload/PreloadProfile/PreloadProfilePage/PreloadProfilePage'
const mockCallBack = jest.fn()
const renderComponents = () => {
    act(() => {
        render(
            <GlobalProvider>
                <I18nextProvider i18n={internationalization}>
                    <PreloadProfile />
                </I18nextProvider>
            </GlobalProvider>
        )
    })
}
describe("When everything is fine", () => {
    beforeEach(async () => {
        renderComponents
    })
    test("should virtual profile render without crashed", () => {
        screen.debug()
    });
    test('should profile list empty display profile not available for listing', () => {
        // expect(screen.queryAllByRole('row')).toHaveLength(0)
        expect(screen.getByText(/Virtual Preload/)).toBeInTheDocument();
        screen.debug()
    });
})