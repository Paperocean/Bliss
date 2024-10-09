import React from 'react';

const Footer = () => {
    return (
        <footer className="footer mt-8 bg-gray-900 text-white py-6">
            <div className="container mx-auto text-center">
                <p className="text-sm">&copy; 2024 ConTic. Wszelkie prawa zastrzeżone.</p>
                <p className="mt-4">
                    <a className="text-blue-400 hover:text-blue-500 transition duration-300 mx-2" href="#">
                        Polityka prywatności
                    </a>
                    <span className="text-gray-500 mx-2">|</span>
                    <a className="text-blue-400 hover:text-blue-500 transition duration-300 mx-2" href="#">
                        Warunki korzystania
                    </a>
                </p>
                <p className="mt-4">
                    <a className="text-blue-400 hover:text-blue-500 transition duration-300 mx-2" href="#">
                        Kontakt
                    </a>
                    <span className="text-gray-500 mx-2">|</span>
                    <a className="text-blue-400 hover:text-blue-500 transition duration-300 mx-2" href="#">
                        O nas
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;