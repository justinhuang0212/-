// 配置設定（內建）
const CONFIG = {
    CHATGPT_API_KEY: 'YOUR_API_KEY_HERE', // 請在部署後設定你的 API Key
    API_MODEL: 'gpt-3.5-turbo',
    MAX_TOKENS: 1500,
    TEMPERATURE: 0.7
};

// 不同業態的人事成本配置比例
const industryConfig = {
    retail: {
        name: '零售業',
        hrRatio: 0.35,
        departments: {
            sales: { ratio: 0.45, avgSalary: 35000 },
            product: { ratio: 0.25, avgSalary: 40000 },
            marketing: { ratio: 0.15, avgSalary: 45000 },
            admin: { ratio: 0.15, avgSalary: 38000 }
        }
    },
    manufacturing: {
        name: '製造業',
        hrRatio: 0.30,
        departments: {
            sales: { ratio: 0.25, avgSalary: 40000 },
            product: { ratio: 0.50, avgSalary: 42000 },
            marketing: { ratio: 0.10, avgSalary: 48000 },
            admin: { ratio: 0.15, avgSalary: 40000 }
        }
    },
    service: {
        name: '服務業',
        hrRatio: 0.45,
        departments: {
            sales: { ratio: 0.35, avgSalary: 38000 },
            product: { ratio: 0.35, avgSalary: 45000 },
            marketing: { ratio: 0.20, avgSalary: 50000 },
            admin: { ratio: 0.10, avgSalary: 36000 }
        }
    },
    technology: {
        name: '科技業',
        hrRatio: 0.40,
        departments: {
            sales: { ratio: 0.20, avgSalary: 55000 },
            product: { ratio: 0.50, avgSalary: 65000 },
            marketing: { ratio: 0.20, avgSalary: 60000 },
            admin: { ratio: 0.10, avgSalary: 45000 }
        }
    },
    food: {
        name: '餐飲業',
        hrRatio: 0.40,
        departments: {
            sales: { ratio: 0.60, avgSalary: 32000 },
            product: { ratio: 0.25, avgSalary: 35000 },
            marketing: { ratio: 0.10, avgSalary: 40000 },
            admin: { ratio: 0.05, avgSalary: 38000 }
        }
    },
    construction: {
        name: '建築業',
        hrRatio: 0.32,
        departments: {
            sales: { ratio: 0.20, avgSalary: 45000 },
            product: { ratio: 0.60, avgSalary: 48000 },
            marketing: { ratio: 0.05, avgSalary: 50000 },
            admin: { ratio: 0.15, avgSalary: 42000 }
        }
    },
    consulting: {
        name: '顧問業',
        hrRatio: 0.50,
        departments: {
            sales: { ratio: 0.30, avgSalary: 60000 },
            product: { ratio: 0.50, avgSalary: 70000 },
            marketing: { ratio: 0.15, avgSalary: 65000 },
            admin: { ratio: 0.05, avgSalary: 45000 }
        }
    },
    other: {
        name: '其他',
        hrRatio: 0.35,
        departments: {
            sales: { ratio: 0.30, avgSalary: 40000 },
            product: { ratio: 0.40, avgSalary: 42000 },
            marketing: { ratio: 0.15, avgSalary: 45000 },
            admin: { ratio: 0.15, avgSalary: 38000 }
        }
    }
};

// 全域變數
let calculationData = null;

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