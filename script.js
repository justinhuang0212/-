// 配置設定（內建）
const CONFIG = {
    CHATGPT_API_KEY: 'YOUR_API_KEY_HERE', // 請在部署後設定你的 API Key
    API_MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 1500,
    TEMPERATURE: 0.7
};

// 全域變數
let calculationData = null;

// 業態分類對應表
const businessCategories = {
    food_service: [
        { value: 'restaurant', text: '小吃/便當/熱炒/火鍋/燒肉等堂食餐廳' },
        { value: 'beverage_chain', text: '手搖飲/咖啡/甜點/早午餐品牌（2-5門市型）' },
        { value: 'catering_service', text: '外燴/餐盒/中央廚房型小團隊' }
    ],
    retail_ecommerce: [
        { value: 'fashion_ecommerce', text: '服飾/鞋包/飾品買手型公司（電商+直播）' },
        { value: 'retail_chain', text: '實體零售門市小連鎖（3C配件/手機維修/保健食品/藥妝）' },
        { value: 'ecommerce_brand', text: '自有品牌電商（蝦皮/MOMO/官網DTC）' }
    ],
    beauty_health: [
        { value: 'beauty_fitness', text: '美容美體/醫美門診/健身教室/運動教練工作室' }
    ],
    education: [
        { value: 'education_training', text: '企業內訓/補教/才藝教室/技職訓練中心' }
    ],
    real_estate: [
        { value: 'real_estate', text: '仲介/代管（不動產仲介/包租代管/社宅代管）' }
    ],
    automotive: [
        { value: 'auto_service', text: '汽機車保修與鈑噴/定檢保養' },
        { value: 'auto_parts', text: '汽機車零件批發/維修體系零件供應商' }
    ],
    engineering: [
        { value: 'electrical_engineering', text: '水電工程行/弱電監控佈線團隊' },
        { value: 'interior_design', text: '室內裝修/系統櫥櫃/木作/設計統包公司' },
        { value: 'construction', text: '小型營造/土木包商' },
        { value: 'green_energy', text: '太陽能/節能設備/淨零相關施工小團隊' },
        { value: 'facility_maintenance', text: '廠房機電維護團隊（長約維修保養）' }
    ],
    design_marketing: [
        { value: 'design_marketing', text: '平面設計/品牌設計/行銷代營運公司' }
    ],
    technology: [
        { value: 'it_consulting', text: '網站/系統整合/軟體客製/AI顧問小型公司' }
    ],
    manufacturing: [
        { value: 'metal_manufacturing', text: '金屬加工/機械零配件工廠' },
        { value: 'plastic_manufacturing', text: '塑膠射出/包裝/印刷加工廠' },
        { value: 'food_oem', text: '食品代工/醬料代工/烘焙代工工作室' },
        { value: 'cosmetic_oem', text: '美妝/清潔用品OEM/ODM小工廠' },
        { value: 'gift_manufacturing', text: '客製化禮贈品/廣告贈品工廠' }
    ],
    outsourcing: [
        { value: 'outsourcing_service', text: '清潔外包/派遣/安管（保全/清潔/臨時工派遣）' }
    ],
    logistics: [
        { value: 'logistics', text: '物流/快遞/倉儲代管/外送車隊' }
    ],
    trading: [
        { value: 'supply_chain', text: '原物料/零組件供應商（B2B供應）' },
        { value: 'import_export', text: '進出口貿易公司（代理國外品牌）' },
        { value: 'product_agency', text: '食品/保健品/化妝品代理商' }
    ],
    tourism: [
        { value: 'hospitality', text: '民宿/旅宿/包棟/露營園區經營團隊' },
        { value: 'tourism', text: '在地觀光體驗/旅遊小包團公司' }
    ]
};

// 更新業態細項選單
function updateBusinessTypes() {
    console.log('updateBusinessTypes 被呼叫');
    
    const categorySelect = document.getElementById('businessCategory');
    const typeSelect = document.getElementById('businessType');
    
    if (!categorySelect || !typeSelect) {
        console.error('找不到選單元素');
        return;
    }
    
    const selectedCategory = categorySelect.value;
    console.log('選擇的大類:', selectedCategory);
    
    // 清空細項選單
    typeSelect.innerHTML = '';
    
    if (!selectedCategory) {
        typeSelect.disabled = true;
        typeSelect.innerHTML = '<option value="">請先選擇業態大類</option>';
        return;
    }
    
    // 啟用細項選單
    typeSelect.disabled = false;
    typeSelect.innerHTML = '<option value="">請選擇具體業態</option>';
    
    // 加入對應的細項選項
    const businessTypes = businessCategories[selectedCategory];
    console.log('對應的業態:', businessTypes);
    
    if (businessTypes) {
        businessTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type.value;
            option.textContent = type.text;
            typeSelect.appendChild(option);
        });
        console.log('已加入', businessTypes.length, '個選項');
    }
}// 台灣
中小企業行業配置（30個常見行業分類）
const industryConfig = {
    // 餐飲服務類
    restaurant: {
        name: '小吃/便當/熱炒/火鍋/燒肉等堂食餐廳',
        hrRatio: 0.42,
        departments: {
            sales: { ratio: 0.65, avgSalary: 32000 },
            product: { ratio: 0.25, avgSalary: 35000 },
            marketing: { ratio: 0.05, avgSalary: 38000 },
            admin: { ratio: 0.05, avgSalary: 40000 }
        }
    },
    beverage_chain: {
        name: '手搖飲/咖啡/甜點/早午餐品牌（2-5門市型）',
        hrRatio: 0.45,
        departments: {
            sales: { ratio: 0.60, avgSalary: 30000 },
            product: { ratio: 0.20, avgSalary: 33000 },
            marketing: { ratio: 0.10, avgSalary: 42000 },
            admin: { ratio: 0.10, avgSalary: 38000 }
        }
    },
    catering_service: {
        name: '外燴/餐盒/中央廚房型小團隊',
        hrRatio: 0.38,
        departments: {
            sales: { ratio: 0.30, avgSalary: 35000 },
            product: { ratio: 0.50, avgSalary: 36000 },
            marketing: { ratio: 0.10, avgSalary: 40000 },
            admin: { ratio: 0.10, avgSalary: 38000 }
        }
    },
    // 零售電商類
    fashion_ecommerce: {
        name: '服飾/鞋包/飾品買手型公司（電商+直播）',
        hrRatio: 0.40,
        departments: {
            sales: { ratio: 0.40, avgSalary: 38000 },
            product: { ratio: 0.25, avgSalary: 42000 },
            marketing: { ratio: 0.25, avgSalary: 45000 },
            admin: { ratio: 0.10, avgSalary: 40000 }
        }
    },
    retail_chain: {
        name: '實體零售門市小連鎖（3C配件/手機維修/保健食品/藥妝）',
        hrRatio: 0.38,
        departments: {
            sales: { ratio: 0.50, avgSalary: 34000 },
            product: { ratio: 0.25, avgSalary: 38000 },
            marketing: { ratio: 0.15, avgSalary: 42000 },
            admin: { ratio: 0.10, avgSalary: 40000 }
        }
    },
    ecommerce_brand: {
        name: '自有品牌電商（蝦皮/MOMO/官網DTC）',
        hrRatio: 0.35,
        departments: {
            sales: { ratio: 0.30, avgSalary: 40000 },
            product: { ratio: 0.30, avgSalary: 45000 },
            marketing: { ratio: 0.30, avgSalary: 48000 },
            admin: { ratio: 0.10, avgSalary: 42000 }
        }
    },
    // 美容健康類
    beauty_fitness: {
        name: '美容美體/醫美門診/健身教室/運動教練工作室',
        hrRatio: 0.48,
        departments: {
            sales: { ratio: 0.35, avgSalary: 38000 },
            product: { ratio: 0.45, avgSalary: 45000 },
            marketing: { ratio: 0.15, avgSalary: 42000 },
            admin: { ratio: 0.05, avgSalary: 40000 }
        }
    },
    // 教育培訓類
    education_training: {
        name: '企業內訓/補教/才藝教室/技職訓練中心',
        hrRatio: 0.55,
        departments: {
            sales: { ratio: 0.25, avgSalary: 42000 },
            product: { ratio: 0.55, avgSalary: 48000 },
            marketing: { ratio: 0.15, avgSalary: 45000 },
            admin: { ratio: 0.05, avgSalary: 38000 }
        }
    },
    // 房地產服務類
    real_estate: {
        name: '仲介/代管（不動產仲介/包租代管/社宅代管）',
        hrRatio: 0.45,
        departments: {
            sales: { ratio: 0.60, avgSalary: 40000 },
            product: { ratio: 0.20, avgSalary: 38000 },
            marketing: { ratio: 0.15, avgSalary: 42000 },
            admin: { ratio: 0.05, avgSalary: 40000 }
        }
    },
    // 汽車服務類
    auto_service: {
        name: '汽機車保修與鈑噴/定檢保養',
        hrRatio: 0.35,
        departments: {
            sales: { ratio: 0.25, avgSalary: 36000 },
            product: { ratio: 0.60, avgSalary: 42000 },
            marketing: { ratio: 0.10, avgSalary: 40000 },
            admin: { ratio: 0.05, avgSalary: 38000 }
        }
    },
    auto_parts: {
        name: '汽機車零件批發/維修體系零件供應商',
        hrRatio: 0.32,
        departments: {
            sales: { ratio: 0.40, avgSalary: 38000 },
            product: { ratio: 0.35, avgSalary: 40000 },
            marketing: { ratio: 0.15, avgSalary: 42000 },
            admin: { ratio: 0.10, avgSalary: 40000 }
        }
    },
    // 工程建設類
    electrical_engineering: {
        name: '水電工程行/弱電監控佈線團隊',
        hrRatio: 0.38,
        departments: {
            sales: { ratio: 0.20, avgSalary: 42000 },
            product: { ratio: 0.65, avgSalary: 45000 },
            marketing: { ratio: 0.10, avgSalary: 40000 },
            admin: { ratio: 0.05, avgSalary: 38000 }
        }
    },
    interior_design: {
        name: '室內裝修/系統櫥櫃/木作/設計統包公司',
        hrRatio: 0.40,
        departments: {
            sales: { ratio: 0.25, avgSalary: 45000 },
            product: { ratio: 0.55, avgSalary: 48000 },
            marketing: { ratio: 0.15, avgSalary: 42000 },
            admin: { ratio: 0.05, avgSalary: 40000 }
        }
    },
    construction: {
        name: '小型營造/土木包商',
        hrRatio: 0.32,
        departments: {
            sales: { ratio: 0.15, avgSalary: 48000 },
            product: { ratio: 0.70, avgSalary: 45000 },
            marketing: { ratio: 0.05, avgSalary: 40000 },
            admin: { ratio: 0.10, avgSalary: 42000 }
        }
    },
    green_energy: {
        name: '太陽能/節能設備/淨零相關施工小團隊',
        hrRatio: 0.35,
        departments: {
            sales: { ratio: 0.25, avgSalary: 45000 },
            product: { ratio: 0.60, avgSalary: 48000 },
            marketing: { ratio: 0.10, avgSalary: 42000 },
            admin: { ratio: 0.05, avgSalary: 40000 }
        }
    },
    facility_maintenance: {
        name: '廠房機電維護團隊（長約維修保養）',
        hrRatio: 0.40,
        departments: {
            sales: { ratio: 0.20, avgSalary: 45000 },
            product: { ratio: 0.65, avgSalary: 48000 },
            marketing: { ratio: 0.10, avgSalary: 42000 },
            admin: { ratio: 0.05, avgSalary: 40000 }
        }
    },
    // 設計行銷類
    design_marketing: {
        name: '平面設計/品牌設計/行銷代營運公司',
        hrRatio: 0.50,
        departments: {
            sales: { ratio: 0.25, avgSalary: 45000 },
            product: { ratio: 0.50, avgSalary: 50000 },
            marketing: { ratio: 0.20, avgSalary: 48000 },
            admin: { ratio: 0.05, avgSalary: 42000 }
        }
    },
    // 科技資訊類
    it_consulting: {
        name: '網站/系統整合/軟體客製/AI顧問小型公司',
        hrRatio: 0.45,
        departments: {
            sales: { ratio: 0.20, avgSalary: 55000 },
            product: { ratio: 0.60, avgSalary: 65000 },
            marketing: { ratio: 0.15, avgSalary: 50000 },
            admin: { ratio: 0.05, avgSalary: 45000 }
        }
    },
    // 製造加工類
    metal_manufacturing: {
        name: '金屬加工/機械零配件工廠',
        hrRatio: 0.30,
        departments: {
            sales: { ratio: 0.20, avgSalary: 42000 },
            product: { ratio: 0.65, avgSalary: 45000 },
            marketing: { ratio: 0.05, avgSalary: 40000 },
            admin: { ratio: 0.10, avgSalary: 42000 }
        }
    },
    plastic_manufacturing: {
        name: '塑膠射出/包裝/印刷加工廠',
        hrRatio: 0.28,
        departments: {
            sales: { ratio: 0.25, avgSalary: 40000 },
            product: { ratio: 0.60, avgSalary: 42000 },
            marketing: { ratio: 0.05, avgSalary: 38000 },
            admin: { ratio: 0.10, avgSalary: 40000 }
        }
    },
    food_oem: {
        name: '食品代工/醬料代工/烘焙代工工作室',
        hrRatio: 0.32,
        departments: {
            sales: { ratio: 0.25, avgSalary: 38000 },
            product: { ratio: 0.60, avgSalary: 40000 },
            marketing: { ratio: 0.05, avgSalary: 40000 },
            admin: { ratio: 0.10, avgSalary: 38000 }
        }
    },
    cosmetic_oem: {
        name: '美妝/清潔用品OEM/ODM小工廠',
        hrRatio: 0.30,
        departments: {
            sales: { ratio: 0.30, avgSalary: 42000 },
            product: { ratio: 0.50, avgSalary: 45000 },
            marketing: { ratio: 0.10, avgSalary: 45000 },
            admin: { ratio: 0.10, avgSalary: 40000 }
        }
    },
    gift_manufacturing: {
        name: '客製化禮贈品/廣告贈品工廠',
        hrRatio: 0.32,
        departments: {
            sales: { ratio: 0.35, avgSalary: 38000 },
            product: { ratio: 0.50, avgSalary: 40000 },
            marketing: { ratio: 0.10, avgSalary: 42000 },
            admin: { ratio: 0.05, avgSalary: 38000 }
        }
    },
    // 服務外包類
    outsourcing_service: {
        name: '清潔外包/派遣/安管（保全/清潔/臨時工派遣）',
        hrRatio: 0.50,
        departments: {
            sales: { ratio: 0.20, avgSalary: 35000 },
            product: { ratio: 0.70, avgSalary: 30000 },
            marketing: { ratio: 0.05, avgSalary: 38000 },
            admin: { ratio: 0.05, avgSalary: 38000 }
        }
    },
    // 物流運輸類
    logistics: {
        name: '物流/快遞/倉儲代管/外送車隊',
        hrRatio: 0.45,
        departments: {
            sales: { ratio: 0.15, avgSalary: 38000 },
            product: { ratio: 0.70, avgSalary: 35000 },
            marketing: { ratio: 0.05, avgSalary: 40000 },
            admin: { ratio: 0.10, avgSalary: 40000 }
        }
    },
    // 貿易供應類
    supply_chain: {
        name: '原物料/零組件供應商（B2B供應）',
        hrRatio: 0.28,
        departments: {
            sales: { ratio: 0.40, avgSalary: 45000 },
            product: { ratio: 0.35, avgSalary: 42000 },
            marketing: { ratio: 0.15, avgSalary: 45000 },
            admin: { ratio: 0.10, avgSalary: 42000 }
        }
    },
    import_export: {
        name: '進出口貿易公司（代理國外品牌）',
        hrRatio: 0.35,
        departments: {
            sales: { ratio: 0.45, avgSalary: 48000 },
            product: { ratio: 0.25, avgSalary: 45000 },
            marketing: { ratio: 0.20, avgSalary: 50000 },
            admin: { ratio: 0.10, avgSalary: 45000 }
        }
    },
    product_agency: {
        name: '食品/保健品/化妝品代理商',
        hrRatio: 0.38,
        departments: {
            sales: { ratio: 0.50, avgSalary: 42000 },
            product: { ratio: 0.25, avgSalary: 40000 },
            marketing: { ratio: 0.20, avgSalary: 48000 },
            admin: { ratio: 0.05, avgSalary: 42000 }
        }
    },
    // 觀光旅遊類
    hospitality: {
        name: '民宿/旅宿/包棟/露營園區經營團隊',
        hrRatio: 0.42,
        departments: {
            sales: { ratio: 0.30, avgSalary: 35000 },
            product: { ratio: 0.50, avgSalary: 32000 },
            marketing: { ratio: 0.15, avgSalary: 40000 },
            admin: { ratio: 0.05, avgSalary: 38000 }
        }
    },
    tourism: {
        name: '在地觀光體驗/旅遊小包團公司',
        hrRatio: 0.45,
        departments: {
            sales: { ratio: 0.35, avgSalary: 38000 },
            product: { ratio: 0.45, avgSalary: 40000 },
            marketing: { ratio: 0.15, avgSalary: 42000 },
            admin: { ratio: 0.05, avgSalary: 38000 }
        }
    }
};

function calculateHRCosts() {
    console.log('calculateHRCosts 函數被呼叫');
    
    // 獲取輸入值
    const companyName = document.getElementById('companyName').value;
    const businessType = document.getElementById('businessType').value;
    const revenue = parseFloat(document.getElementById('revenue').value) || 0;
    const grossMargin = parseFloat(document.getElementById('grossMargin').value) || 0;
    const employeeCount = parseInt(document.getElementById('employeeCount').value) || 0;
    
    console.log('輸入值：', { companyName, businessType, revenue, grossMargin, employeeCount });
    
    // 驗證輸入
    if (!businessType || revenue <= 0 || grossMargin <= 0) {
        alert('請填寫完整的公司資料');
        return;
    }
    
    // 計算毛利
    const grossProfit = revenue * 10000 * (grossMargin / 100);
    
    // 獲取業態配置
    const config = industryConfig[businessType];
    
    // 計算總人事成本
    const totalHRCost = grossProfit * config.hrRatio;
    const monthlyHRCost = totalHRCost / 12;
    
    // 計算各部門配置
    const departments = calculateDepartments(config, monthlyHRCost);
    
    // 儲存計算數據
    calculationData = {
        companyName,
        businessType: config.name,
        revenue,
        grossMargin,
        employeeCount,
        grossProfit,
        totalHRCost,
        departments,
        hrRatio: config.hrRatio
    };
    
    console.log('計算結果：', calculationData);
    
    // 顯示結果
    displayResults(grossProfit, totalHRCost, config.hrRatio, departments, config.name);
    
    // 自動呼叫 AI 生成建議
    generateAIRecommendations();
}

function calculateDepartments(config, monthlyHRCost) {
    const departments = {};
    
    Object.keys(config.departments).forEach(dept => {
        const deptConfig = config.departments[dept];
        const deptBudget = monthlyHRCost * deptConfig.ratio;
        const headcount = Math.max(1, Math.round(deptBudget / deptConfig.avgSalary));
        
        departments[dept] = {
            headcount: headcount,
            budget: deptBudget,
            avgSalary: deptConfig.avgSalary
        };
    });
    
    return departments;
}

function displayResults(grossProfit, totalHRCost, hrRatio, departments, industryName) {
    console.log('顯示結果');
    
    // 顯示摘要
    document.getElementById('grossProfit').textContent = `NT$ ${grossProfit.toLocaleString()}`;
    document.getElementById('totalHRCost').textContent = `NT$ ${totalHRCost.toLocaleString()}`;
    document.getElementById('hrRatio').textContent = `${(hrRatio * 100).toFixed(1)}%`;
    
    // 顯示各部門
    document.getElementById('salesCount').textContent = departments.sales.headcount;
    document.getElementById('salesCost').textContent = `NT$ ${Math.round(departments.sales.budget).toLocaleString()}`;
    
    document.getElementById('productCount').textContent = departments.product.headcount;
    document.getElementById('productCost').textContent = `NT$ ${Math.round(departments.product.budget).toLocaleString()}`;
    
    document.getElementById('marketingCount').textContent = departments.marketing.headcount;
    document.getElementById('marketingCost').textContent = `NT$ ${Math.round(departments.marketing.budget).toLocaleString()}`;
    
    document.getElementById('adminCount').textContent = departments.admin.headcount;
    document.getElementById('adminCost').textContent = `NT$ ${Math.round(departments.admin.budget).toLocaleString()}`;
    
    // 顯示結果區域
    document.getElementById('results').style.display = 'block';
}

// 自動生成 AI 建議
async function generateAIRecommendations() {
    if (!calculationData) {
        return;
    }
    
    // 顯示載入狀態
    document.getElementById('ai-loading').style.display = 'flex';
    document.getElementById('ai-recommendations-content').innerHTML = '';
    
    try {
        const analysis = await callChatGPTAPI(CONFIG.CHATGPT_API_KEY, calculationData);
        displayAIRecommendations(analysis);
    } catch (error) {
        console.error('AI 分析錯誤:', error);
        
        // 如果 API 失敗，顯示基本建議
        displayBasicRecommendations();
        
        // 可選：顯示錯誤訊息
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'margin-top: 15px; padding: 10px; background: #fff3cd; border-radius: 5px; font-size: 0.9em; color: #856404;';
        errorDiv.innerHTML = '<strong>注意：</strong>AI 服務暫時無法使用，以上為基本建議。';
        document.getElementById('ai-recommendations-content').appendChild(errorDiv);
    } finally {
        document.getElementById('ai-loading').style.display = 'none';
    }
}

// 顯示基本建議（當 AI 無法使用時）
function displayBasicRecommendations() {
    const { companyName, businessType, revenue, employeeCount, departments } = calculationData;
    const totalRecommendedEmployees = Object.values(departments).reduce((sum, dept) => sum + dept.headcount, 0);
    
    let recommendations = `
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h4>基本建議分析</h4>
            <p><strong>根據 ${companyName || '貴公司'} 的${businessType}特性：</strong></p>
            <ul>
                <li><strong>建議總員工數：</strong>${totalRecommendedEmployees}人（目前：${employeeCount}人）</li>
    `;
    
    if (totalRecommendedEmployees > employeeCount) {
        recommendations += `<li><strong>人力缺口：</strong>建議增加 ${totalRecommendedEmployees - employeeCount} 人</li>`;
    } else if (totalRecommendedEmployees < employeeCount) {
        recommendations += `<li><strong>人力配置：</strong>可考慮優化 ${employeeCount - totalRecommendedEmployees} 人的配置</li>`;
    }
    
    recommendations += `
                <li><strong>優先發展順序：</strong>
                    <ol>
                        <li>產品服務部門 - 提升核心競爭力</li>
                        <li>銷售部門 - 擴大營收規模</li>
                        <li>行銷部門 - 建立品牌知名度</li>
                        <li>行政支援部門 - 提升營運效率</li>
                    </ol>
                </li>
                <li><strong>薪資策略：</strong>建議將人事成本控制在毛利的適當比例內</li>
            </ul>
        </div>
    `;
    
    document.getElementById('ai-recommendations-content').innerHTML = recommendations;
}

// 顯示 AI 建議結果
function displayAIRecommendations(analysis) {
    const formattedAnalysis = analysis
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    document.getElementById('ai-recommendations-content').innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <p>${formattedAnalysis}</p>
        </div>
        <div style="margin-top: 15px; padding: 10px; background: #e8f5e8; border-radius: 5px; font-size: 0.9em; color: #2d5a2d;">
            <strong>💡 提示：</strong>以上建議由 AI 根據您的企業資料量身定制，建議結合實際情況參考使用。
        </div>
    `;
}

// 呼叫 ChatGPT API
async function callChatGPTAPI(apiKey, data) {
    const prompt = `
作為一位專業的人力資源顧問，請根據以下中小企業資料提供詳細的人事成本分析和建議：

公司資料：
- 公司名稱：${data.companyName || '未提供'}
- 業態：${data.businessType}
- 年營業額：${data.revenue}萬元
- 毛利率：${data.grossMargin}%
- 年毛利：${Math.round(data.grossProfit/10000)}萬元
- 目前員工人數：${data.employeeCount}人

計算結果：
- 建議年人事成本：${Math.round(data.totalHRCost/10000)}萬元（占毛利${(data.hrRatio*100).toFixed(1)}%）
- 銷售部門：${data.departments.sales.headcount}人，月成本${Math.round(data.departments.sales.budget/10000)}萬元
- 產品服務部門：${data.departments.product.headcount}人，月成本${Math.round(data.departments.product.budget/10000)}萬元
- 行銷部門：${data.departments.marketing.headcount}人，月成本${Math.round(data.departments.marketing.budget/10000)}萬元
- 行政支援部門：${data.departments.admin.headcount}人，月成本${Math.round(data.departments.admin.budget/10000)}萬元

請提供：
1. 對這個人事配置的專業評估
2. 具體的優化建議
3. 風險提醒
4. 實施步驟建議

請用繁體中文回答，內容要實用且具體。
`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            model: CONFIG.API_MODEL,
            messages: [
                {
                    role: 'system',
                    content: '你是一位專業的人力資源顧問，專精於中小企業人事成本規劃。請提供實用、具體的建議。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_tokens: CONFIG.MAX_TOKENS,
            temperature: CONFIG.TEMPERATURE
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || `API 請求失敗 (${response.status})`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
}

// 輸入驗證和格式化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 載入完成');
    
    // 綁定業態大類選擇事件
    const categorySelect = document.getElementById('businessCategory');
    if (categorySelect) {
        categorySelect.addEventListener('change', updateBusinessTypes);
        console.log('業態大類選擇事件已綁定');
    } else {
        console.error('找不到 businessCategory 元素');
    }
    
    const revenueInput = document.getElementById('revenue');
    const marginInput = document.getElementById('grossMargin');
    
    if (revenueInput) {
        revenueInput.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
        });
    }
    
    if (marginInput) {
        marginInput.addEventListener('input', function() {
            if (this.value < 0) this.value = 0;
            if (this.value > 100) this.value = 100;
        });
    }
    
    // Enter 鍵觸發計算
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateHRCosts();
            }
        });
    });
});