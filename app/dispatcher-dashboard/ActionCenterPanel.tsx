'use client';
 
import React from 'react';

type ActionCenterNotification = {
id: string;
title: string;
description: string;
severity: 'critical' | 'warning' | 'info' | 'success';
createdAt: string;
};

type Props = {
status: string;
notifications?: ActionCenterNotification[];
};

export default function ActionCenterPanel({
status,
notifications = [],
}: Props) {
return (
<div
style={{
background: '#ffffff',
border: '1px solid #e5e7eb',
borderRadius: 18,
padding: 24,
marginTop: 24,
}}
>
<div
style={{
display: 'flex',
justifyContent: 'space-between',
alignItems: 'center',
marginBottom: 18,
}}
>
<h2
style={{
margin: 0,
fontSize: 22,
fontWeight: 700,
}}
>
Operations Intelligence
</h2>

<span
style={{
fontSize: 13,
color: '#6b7280',
}}
>
{status}
</span>
</div>
<div
style={{
display: 'grid',
gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
gap: 14,
marginBottom: 18,
}}
>
<div
style={{
padding: 18,
borderRadius: 14,
background: '#f0fdf4',
border: '1px solid #bbf7d0',
}}
>
<div
style={{
fontSize: 12,
fontWeight: 700,
color: '#166534',
textTransform: 'uppercase',
letterSpacing: 0.6,
marginBottom: 8,
}}
>
Transport Health
</div>

<div
style={{
display: 'flex',
alignItems: 'baseline',
gap: 8,
}}
>
<span
style={{
fontSize: 32,
fontWeight: 800,
color: '#166534',
}}
>
96%
</span>

<span
style={{
fontSize: 14,
fontWeight: 700,
color: '#15803d',
}}
>
Healthy
</span>
</div>
</div>

<div
style={{
padding: 18,
borderRadius: 14,
background: '#fff7ed',
border: '1px solid #fed7aa',
}}
>
<div
style={{
fontSize: 12,
fontWeight: 700,
color: '#9a3412',
textTransform: 'uppercase',
letterSpacing: 0.6,
marginBottom: 8,
}}
>
Operational Risk
</div>

<div
style={{
fontSize: 18,
fontWeight: 750,
color: '#9a3412',
}}
>
Low
</div>

<div
style={{
marginTop: 6,
fontSize: 13,
color: '#c2410c',
}}
>
No significant delay indicators detected.
</div>
</div>

<div
style={{
padding: 18,
borderRadius: 14,
background: '#eff6ff',
border: '1px solid #bfdbfe',
}}
>
<div
style={{
fontSize: 12,
fontWeight: 700,
color: '#1d4ed8',
textTransform: 'uppercase',
letterSpacing: 0.6,
marginBottom: 8,
}}
>
Next Action
</div>

<div
style={{
fontSize: 15,
fontWeight: 700,
color: '#1e3a8a',
}}
>
Continue monitoring
</div>

<div
style={{
marginTop: 6,
fontSize: 13,
color: '#1d4ed8',
}}
>
No staff intervention is currently required.
</div>
</div>
</div>

{notifications.length === 0 ? (
<div
style={{
padding: 20,
borderRadius: 12,
background: '#f8fafc',
color: '#64748b',
}}
>
All active transports are operating normally.
</div>
) : (
notifications.map((item) => (
<div
key={item.id}
style={{
marginBottom: 14,
padding: 16,
borderRadius: 12,
border: '1px solid #e5e7eb',
}}
>
<div
style={{
fontWeight: 700,
marginBottom: 6,
}}
>
{item.title}
</div>

<div
style={{
color: '#64748b',
marginBottom: 8,
}}
>
{item.description}
</div>

<div
style={{
fontSize: 12,
color: '#94a3b8',
}}
>
{item.createdAt}
</div>
</div>
))
)}
</div>
);
}
