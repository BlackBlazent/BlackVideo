/*
 * Copyright (c) 2026 BlackVideo (Zephyra)
 * All Rights Reserved.
 *
 * This source code is the confidential and proprietary property of BlackVideo.
 * Unauthorized copying, modification, distribution, or use of this source code,
 * in whole or in part, is strictly prohibited without prior written permission
 * from BlackVideo.
 */

import React from 'react';
import { ItemGridCard, ItemListTile } from './globalMarketHook.ui';
import { ExtensionPlugin } from '../../../blackvideo-dts/extentionPage';

export const SubscriptionMarketView: React.FC<{ 
    items: ExtensionPlugin[], 
    viewMode: 'grid' | 'list', 
    openDetails: (item: ExtensionPlugin) => void 
}> = ({ items, viewMode, openDetails }) => (
    <>
        {items.map(item => (
            viewMode === 'grid' 
                ? <ItemGridCard key={item.id} item={item} openDetails={openDetails} />
                : <ItemListTile key={item.id} item={item} openDetails={openDetails} />
        ))}
    </>
);