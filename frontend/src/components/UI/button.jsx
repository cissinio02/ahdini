import React, { useState } from 'react';

export default function Button({ children, variant = 'primary', className = '', style = {}, ...props }) {
	const [hovered, setHovered] = useState(false);
	const [pressed, setPressed] = useState(false);

	const baseStyle = {
		display: 'inline-flex',
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 8,
		padding: '12px 18px',
		fontWeight: 700,
		fontSize: '1rem',
		cursor: 'pointer',
		transition: 'transform 0.14s ease, box-shadow 0.14s ease, background-color 0.12s ease',
		border: 'none',
		minWidth: 140,
		transform: 'scale(1) translateY(0)',
	};

	const variants = {
		primary: {
			background: 'var(--primary-color)',
			color: '#fff',
		},
		secondary: {
			background: '#fff',
			color: '#374151',
			border: '1px solid #e5e7eb',
		},
		ghost: {
			background: 'transparent',
			color: '#374151',
		},
	};

	const hoverStyle = hovered && !pressed ? {
		transform: 'scale(1.02) translateY(-2px)',
		boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
	} : {};

	const pressedStyle = pressed ? {
		transform: 'scale(0.99) translateY(1px)'
	} : {};

	const applied = Object.assign({}, baseStyle, variants[variant] || variants.primary, hoverStyle, pressedStyle, style);

	return (
		<button
			style={applied}
			className={className}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => { setHovered(false); setPressed(false); }}
			onMouseDown={() => setPressed(true)}
			onMouseUp={() => setPressed(false)}
			{...props}
		>
			{children}
		</button>
	);
}
