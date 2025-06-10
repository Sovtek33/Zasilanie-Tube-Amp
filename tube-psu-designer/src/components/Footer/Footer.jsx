import React from 'react';

const Footer = () => {
    return (
        <footer className="mt-12 text-center text-xs text-slate-500 border-t border-slate-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
                <div>
                    PSU Designer v6.0 © 2025 | Professional Edition
                </div>
                <div className="flex items-center gap-4 mt-2 md:mt-0">
                    <span>Rozszerzona baza lamp: 10 prostowników</span>
                    <span>•</span>
                    <span>Wsparcie filtrów LC/RC</span>
                    <span>•</span>
                    <span>Analiza napięć na pinach</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;