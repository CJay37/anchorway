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
Action Center
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

{notifications.length === 0 ? (
<div
style={{
padding: 20,
borderRadius: 12,
background: '#f8fafc',
color: '#64748b',
}}
>
No active operational alerts.
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
