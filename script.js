// 配置設定
const CONFIG = {
    CHATGPT_API_KEY: 'YOUR_API_KEY_HERE',
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
    
    typeSelect.innerHTML = '';
    
    if (!selectedCategory) {
        typeSelect.disabled = true;
        typeSelect.innerHTML = '<option value="">請先選擇業態大類</option>';
        return;
    }
    
    typeSelect.disabled = false;
    typeSelect.innerHTML = '<option value="">請選擇具體業態</option>';
    
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
}

// 行業配置
const industryConfig = {
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
    }
};

function calculateHRCosts() {
    console.log('calculateHRCosts 函數被呼叫');
    
    const companyName = document.getElementById('companyName').value;
    const businessType = document.getElementById('businessType').value;
    const revenue = parseFloat(document.getElementById('revenue').value) || 0;
    const grossMargin = parseFloat(document.getElementById('grossMargin').value) || 0;
    const employeeCount = parseInt(document.getElementById('employeeCount').value) || 0;
    
    console.log('輸入值：', { companyName, businessType, revenue, grossMargin, employeeCount });
    
    if (!businessType || revenue <= 0 || grossMargin <= 0) {
        alert('請填寫完整的公司資料');
        return;
    }
    
    const grossProfit = revenue * 10000 * (grossMargin / 100);
    const config = industryConfig[businessType];
    
    if (!config) {
        alert('找不到對應的行業配置');
        return;
    }
    
    const totalHRCost = grossProfit * config.hrRatio;
    const monthlyHRCost = totalHRCost / 12;
    
    const departments = calculateDepartments(config, monthlyHRCost);
    
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
    
    displayResults(grossProfit, totalHRCost, config.hrRatio, departments, config.name);
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
    
    document.getElementById('grossProfit').textContent = 'NT$ ' + grossProfit.toLocaleString();
    document.getElementById('totalHRCost').textContent = 'NT$ ' + totalHRCost.toLocaleString();
    document.getElementById('hrRatio').textContent = (hrRatio * 100).toFixed(1) + '%';
    
    document.getElementById('salesCount').textContent = departments.sales.headcount;
    document.getElementById('salesCost').textContent = 'NT$ ' + Math.round(departments.sales.budget).toLocaleString();
    
    document.getElementById('productCount').textContent = departments.product.headcount;
    document.getElementById('productCost').textContent = 'NT$ ' + Math.round(departments.product.budget).toLocaleString();
    
    document.getElementById('marketingCount').textContent = departments.marketing.headcount;
    document.getElementById('marketingCost').textContent = 'NT$ ' + Math.round(departments.marketing.budget).toLocaleString();
    
    document.getElementById('adminCount').textContent = departments.admin.headcount;
    document.getElementById('adminCost').textContent = 'NT$ ' + Math.round(departments.admin.budget).toLocaleString();
    
    document.getElementById('results').style.display = 'block';
}

async function generateAIRecommendations() {
    if (!calculationData) {
        return;
    }
    
    document.getElementById('ai-loading').style.display = 'flex';
    document.getElementById('ai-recommendations-content').innerHTML = '';
    
    try {
        displayBasicRecommendations();
    } catch (error) {
        console.error('生成建議錯誤:', error);
    } finally {
        document.getElementById('ai-loading').style.display = 'none';
    }
}

function displayBasicRecommendations() {
    const data = calculationData;
    const totalRecommendedEmployees = Object.values(data.departments).reduce((sum, dept) => sum + dept.headcount, 0);
    
    let recommendations = '<div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">';
    recommendations += '<h4>基本建議分析</h4>';
    recommendations += '<p><strong>根據 ' + (data.companyName || '貴公司') + ' 的' + data.businessType + '特性：</strong></p>';
    recommendations += '<ul>';
    recommendations += '<li><strong>建議總員工數：</strong>' + totalRecommendedEmployees + '人（目前：' + data.employeeCount + '人）</li>';
    
    if (totalRecommendedEmployees > data.employeeCount) {
        recommendations += '<li><strong>人力缺口：</strong>建議增加 ' + (totalRecommendedEmployees - data.employeeCount) + ' 人</li>';
    } else if (totalRecommendedEmployees < data.employeeCount) {
        recommendations += '<li><strong>人力配置：</strong>可考慮優化 ' + (data.employeeCount - totalRecommendedEmployees) + ' 人的配置</li>';
    }
    
    recommendations += '<li><strong>優先發展順序：</strong>';
    recommendations += '<ol>';
    recommendations += '<li>產品服務部門 - 提升核心競爭力</li>';
    recommendations += '<li>銷售部門 - 擴大營收規模</li>';
    recommendations += '<li>行銷部門 - 建立品牌知名度</li>';
    recommendations += '<li>行政支援部門 - 提升營運效率</li>';
    recommendations += '</ol>';
    recommendations += '</li>';
    recommendations += '<li><strong>薪資策略：</strong>建議將人事成本控制在毛利的適當比例內</li>';
    recommendations += '</ul>';
    recommendations += '</div>';
    
    document.getElementById('ai-recommendations-content').innerHTML = recommendations;
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM 載入完成');
    
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
    
    document.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateHRCosts();
            }
        });
    });
});