# Searchable Picklist - 使用ガイド

## 概要

このガイドでは、`searchablePicklist` コンポーネントの実際の使用方法を詳しく説明します。

## 基本的な使い方

### 1. 最小限の実装

最もシンプルな使い方です。options だけを渡します。

```html
<template>
    <c-searchable-picklist
        options={options}
    ></c-searchable-picklist>
</template>
```

```javascript
import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {
    options = [
        { label: 'りんご', value: 'apple' },
        { label: 'バナナ', value: 'banana' },
        { label: 'さくらんぼ', value: 'cherry' }
    ];
}
```

### 2. 選択イベントをハンドル

ユーザーが項目を選択したときに処理を実行します。

```html
<template>
    <c-searchable-picklist
        options={options}
        onoptionselected={handleOptionSelected}
    ></c-searchable-picklist>
    
    <template if:true={selectedValue}>
        <p>選択された値: {selectedValue}</p>
    </template>
</template>
```

```javascript
import { LightningElement, track } from 'lwc';

export default class MyComponent extends LightningElement {
    @track selectedValue;
    
    options = [
        { label: 'りんご', value: 'apple' },
        { label: 'バナナ', value: 'banana' }
    ];
    
    handleOptionSelected(event) {
        const selectedOption = event.detail.selectedOption;
        this.selectedValue = selectedOption.label;
        
        // 選択された値で何か処理を行う
        console.log('Selected:', selectedOption);
    }
}
```

### 3. デフォルト値を設定

初期状態で特定の項目を選択状態にします。

```html
<template>
    <c-searchable-picklist
        options={options}
        init-value="banana"
        onoptionselected={handleOptionSelected}
    ></c-searchable-picklist>
</template>
```

```javascript
import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {
    options = [
        { label: 'りんご', value: 'apple' },
        { label: 'バナナ', value: 'banana' },
        { label: 'さくらんぼ', value: 'cherry' }
    ];
    
    handleOptionSelected(event) {
        console.log('Selected:', event.detail.selectedOption);
    }
}
```

### 4. デフォルトの検索ワードを設定

初期状態で検索ボックスに文字列を入力し、フィルタされた状態で表示します。

```html
<template>
    <c-searchable-picklist
        options={options}
        init-search-value="りんご"
        onoptionselected={handleOptionSelected}
    ></c-searchable-picklist>
</template>
```

### 5. 公開メソッドを使用

コンポーネントから現在の値を取得します。

```html
<template>
    <c-searchable-picklist
        options={options}
    ></c-searchable-picklist>
    
    <lightning-button
        label="現在の値を取得"
        onclick={handleGetValues}
    ></lightning-button>
</template>
```

```javascript
import { LightningElement } from 'lwc';

export default class MyComponent extends LightningElement {
    options = [
        { label: 'りんご', value: 'apple' },
        { label: 'バナナ', value: 'banana' }
    ];
    
    handleGetValues() {
        const picklist = this.template.querySelector('c-searchable-picklist');
        
        const inputText = picklist.getInputText();
        const selectedOption = picklist.getSelectedOption();
        
        console.log('Input Text:', inputText);
        console.log('Selected Option:', selectedOption);
    }
}
```

## 実践的な例

### 例1: Salesforce のレコードから選択肢を取得

```javascript
import { LightningElement, wire, track } from 'lwc';
import getAccounts from '@salesforce/apex/AccountController.getAccounts';

export default class AccountSelector extends LightningElement {
    @track accountOptions = [];
    @track selectedAccount;
    
    @wire(getAccounts)
    wiredAccounts({ error, data }) {
        if (data) {
            this.accountOptions = data.map(account => ({
                label: account.Name,
                value: account.Id,
                industry: account.Industry
            }));
        } else if (error) {
            console.error('Error loading accounts:', error);
        }
    }
    
    handleAccountSelected(event) {
        this.selectedAccount = event.detail.selectedOption;
        console.log('Selected Account ID:', this.selectedAccount.value);
        console.log('Selected Account Industry:', this.selectedAccount.industry);
    }
}
```

```html
<template>
    <div class="slds-box">
        <h3>取引先を選択</h3>
        <c-searchable-picklist
            options={accountOptions}
            onoptionselected={handleAccountSelected}
        ></c-searchable-picklist>
        
        <template if:true={selectedAccount}>
            <div class="slds-m-top_medium">
                <p><strong>選択された取引先:</strong> {selectedAccount.label}</p>
                <p><strong>業種:</strong> {selectedAccount.industry}</p>
            </div>
        </template>
    </div>
</template>
```

### 例2: 国の選択（大量のオプション）

```javascript
import { LightningElement } from 'lwc';

export default class CountrySelector extends LightningElement {
    countryOptions = [
        { label: '日本', value: 'JP', region: 'Asia' },
        { label: 'アメリカ合衆国', value: 'US', region: 'Americas' },
        { label: 'イギリス', value: 'GB', region: 'Europe' },
        { label: 'ドイツ', value: 'DE', region: 'Europe' },
        { label: 'フランス', value: 'FR', region: 'Europe' },
        { label: '中国', value: 'CN', region: 'Asia' },
        { label: '韓国', value: 'KR', region: 'Asia' },
        { label: 'オーストラリア', value: 'AU', region: 'Oceania' },
        { label: 'カナダ', value: 'CA', region: 'Americas' },
        { label: 'ブラジル', value: 'BR', region: 'Americas' },
        // ... 800項目まで対応可能
    ];
    
    handleCountrySelected(event) {
        const country = event.detail.selectedOption;
        console.log('Selected Country:', country.label);
        console.log('Country Code:', country.value);
        console.log('Region:', country.region);
    }
}
```

### 例3: 動的なオプション生成

```javascript
import { LightningElement, track } from 'lwc';

export default class DynamicOptions extends LightningElement {
    @track options = [];
    
    connectedCallback() {
        // 動的にオプションを生成
        this.generateOptions();
    }
    
    generateOptions() {
        const options = [];
        for (let i = 1; i <= 100; i++) {
            options.push({
                label: `項目 ${i}`,
                value: `item_${i}`,
                index: i
            });
        }
        this.options = options;
    }
    
    handleOptionSelected(event) {
        const selected = event.detail.selectedOption;
        console.log('Selected item index:', selected.index);
    }
}
```

### 例4: フォームでの使用

```html
<template>
    <lightning-card title="お問い合わせフォーム">
        <div class="slds-p-around_medium">
            <div class="slds-form-element">
                <label class="slds-form-element__label">
                    お問い合わせ内容 <abbr class="slds-required">*</abbr>
                </label>
                <div class="slds-form-element__control">
                    <c-searchable-picklist
                        options={inquiryTypes}
                        onoptionselected={handleInquiryTypeSelected}
                    ></c-searchable-picklist>
                </div>
            </div>
            
            <div class="slds-form-element slds-m-top_medium">
                <label class="slds-form-element__label">製品カテゴリ</label>
                <div class="slds-form-element__control">
                    <c-searchable-picklist
                        options={productCategories}
                        onoptionselected={handleCategorySelected}
                    ></c-searchable-picklist>
                </div>
            </div>
            
            <lightning-button
                label="送信"
                variant="brand"
                onclick={handleSubmit}
                class="slds-m-top_medium"
            ></lightning-button>
        </div>
    </lightning-card>
</template>
```

```javascript
import { LightningElement, track } from 'lwc';

export default class ContactForm extends LightningElement {
    @track selectedInquiryType;
    @track selectedCategory;
    
    inquiryTypes = [
        { label: '製品について', value: 'product' },
        { label: '価格について', value: 'pricing' },
        { label: '技術サポート', value: 'support' },
        { label: '営業担当への連絡', value: 'sales' }
    ];
    
    productCategories = [
        { label: 'ソフトウェア', value: 'software' },
        { label: 'ハードウェア', value: 'hardware' },
        { label: 'クラウドサービス', value: 'cloud' },
        { label: 'コンサルティング', value: 'consulting' }
    ];
    
    handleInquiryTypeSelected(event) {
        this.selectedInquiryType = event.detail.selectedOption.value;
    }
    
    handleCategorySelected(event) {
        this.selectedCategory = event.detail.selectedOption.value;
    }
    
    handleSubmit() {
        if (!this.selectedInquiryType) {
            // バリデーションエラー
            console.error('お問い合わせ内容を選択してください');
            return;
        }
        
        // フォーム送信処理
        console.log('Inquiry Type:', this.selectedInquiryType);
        console.log('Category:', this.selectedCategory);
    }
}
```

## キーボード操作

### 検索ボックスにフォーカスがある時

| キー | 動作 |
|------|------|
| 文字入力 | 検索ワードを入力してフィルタ |
| Tab または ↓ | ドロップダウンの最初の項目にフォーカス |
| Enter | 検索結果が1件のみの場合、その項目を選択 |
| Escape | ドロップダウンを閉じる |

### ドロップダウンの項目にフォーカスがある時

| キー | 動作 |
|------|------|
| Enter | フォーカス中の項目を選択 |
| ↑ | 前の項目に移動（最上位で検索ボックスへ） |
| ↓ | 次の項目に移動（最下位で検索ボックスへ） |
| Tab | 次の項目に移動（最下位で検索ボックスへ） |
| Shift+Tab | 前の項目に移動（最上位で検索ボックスへ） |
| Escape | ドロップダウンを閉じて検索ボックスにフォーカス |

## スタイルのカスタマイズ

コンポーネントのスタイルをカスタマイズするには、親コンポーネントで CSS を追加します。

```css
/* parentComponent.css */

/* コンテナのサイズを変更 */
c-searchable-picklist {
    display: block;
    max-width: 400px;
}

/* 特定のスタイルを上書きしたい場合は、::part を使用 */
/* (注: 現在の実装では::part は未対応。将来的な拡張として) */
```

## トラブルシューティング

### 問題: オプションが表示されない

**原因**: options プロパティが正しく設定されていない

**解決策**: options が配列であり、各項目に `label` と `value` プロパティがあることを確認

```javascript
// 正しい形式
options = [
    { label: 'Label 1', value: 'value1' },
    { label: 'Label 2', value: 'value2' }
];

// 間違った形式（動作しない）
options = ['value1', 'value2'];
```

### 問題: イベントが発火しない

**原因**: イベントハンドラが正しく設定されていない

**解決策**: HTML で `onoptionselected` プロパティを正しく設定

```html
<!-- 正しい -->
<c-searchable-picklist
    options={options}
    onoptionselected={handleOptionSelected}
></c-searchable-picklist>

<!-- 間違い -->
<c-searchable-picklist
    options={options}
    onchange={handleOptionSelected}
></c-searchable-picklist>
```

### 問題: initValue が反映されない

**原因**: options の中に該当する value が存在しない

**解決策**: initValue に指定した値が options の中に存在することを確認

```javascript
options = [
    { label: 'りんご', value: 'apple' },
    { label: 'バナナ', value: 'banana' }
];

// OK: 'apple' は options に存在
initValue = 'apple';

// NG: 'orange' は options に存在しない
initValue = 'orange';
```

## ベストプラクティス

1. **明確なラベルを使用**: ユーザーが理解しやすいラベルを設定
2. **適切な件数**: 800件まで対応していますが、可能であれば100件以下に抑える
3. **バリデーション**: 必須項目の場合は、親コンポーネントでバリデーションを実装
4. **エラーハンドリング**: データ取得失敗時の処理を実装
5. **アクセシビリティ**: ラベルを適切に設定し、キーボード操作を説明

## まとめ

`searchablePicklist` コンポーネントは柔軟で使いやすい設計になっています。
基本的な使い方から実践的な例まで、このガイドを参考に実装してください。

さらに詳しい情報は以下を参照：
- [コンポーネント API リファレンス](force-app/main/default/lwc/searchablePicklist/README.md)
- [アーキテクチャドキュメント](COMPONENT_ARCHITECTURE.md)
- [実装サマリー](IMPLEMENTATION_SUMMARY.md)
