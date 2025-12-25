import React, { useState } from 'react';

export default function Input({ label, id, type = 'text', value, onChange, placeholder = '', className = '', error, showPasswordToggle = false }) {
	const [visible, setVisible] = useState(false);
	const [hovered, setHovered] = useState(false);
	const [focused, setFocused] = useState(false);
	const inputType = type === 'password' && showPasswordToggle ? (visible ? 'text' : 'password') : type;

	const baseStyle = {
		width: '100%',
		padding: showPasswordToggle ? '10px 40px 10px 12px' : '10px 12px',
		borderRadius: 8,
		border: '1px solid #e5e7eb',
		outline: 'none',
		transition: 'box-shadow 0.18s ease, transform 0.14s ease',
		transform: 'translateY(0)',
	};

	const active = hovered || focused;
	const activeStyle = active
		? {
				boxShadow: '0 0 8px rgba(112, 11, 11, 0.18)',
				transform: 'translateY(-2px)',
			}
		: {};

	return (
		<div className={className} style={{ marginBottom: 12 }}>
			{label && <label htmlFor={id} style={{ display: 'block', marginBottom: 6, color: '#374151', fontWeight: 600 }}>{label}</label>}

			<div style={{ position: 'relative' }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
				<input
					id={id}
					type={inputType}
					value={value}
					onChange={onChange}
					placeholder={placeholder}
					onFocus={() => setFocused(true)}
					onBlur={() => setFocused(false)}
					style={{ ...baseStyle, ...activeStyle }}
				/>

				{showPasswordToggle && (
					<button
						type="button"
						onClick={() => setVisible(v => !v)}
						aria-label={visible ? 'Hide password' : 'Show password'}
						style={{
							position: 'absolute',
							right: 8,
							top: '50%',
							transform: 'translateY(-50%)',
							background: 'transparent',
							border: 'none',
							cursor: 'pointer',
							padding: 6,
							color: '#81807fff',
							fontSize: 20,
						}}
					>
						{visible ? '⌣' : '👁'}
					</button>
				)}
			</div>

			{error && <div style={{ color: '#ef4444', marginTop: 6 }}>{error}</div>}
		</div>
	);
}
