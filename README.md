# Searchable Picklist in LWC

検索機能付きのプルダウン選択コンポーネント（Lightning Web Component）

## 概要

Salesforceのカスタム画面で、選択肢が多い（最大800項目など）プルダウンを使いやすくする検索機能付きのコンポーネントです。

## 特徴

- 🔍 **検索機能**: 大量の選択肢から素早く目的の項目を見つける
- ⌨️ **キーボードナビゲーション**: Tab、矢印キー、Enterキーで快適に操作
- 🔧 **汎用性**: 他のLWCコンポーネントに簡単に埋め込み可能
- 📱 **レスポンシブ**: 様々な画面サイズに対応
- ⚡ **軽量**: 標準HTMLタグを使用（lightning-input不使用）

## コンポーネント

### searchablePicklist
メインの検索可能なピックリストコンポーネント

詳細は [force-app/main/default/lwc/searchablePicklist/README.md](force-app/main/default/lwc/searchablePicklist/README.md) を参照

### searchablePicklistDemo
使用例を示すデモコンポーネント

## クイックスタート

### 1. プロジェクトのデプロイ

```bash
# Salesforce組織に認証
sfdx auth:web:login -a myOrg

# コンポーネントをデプロイ
sfdx force:source:deploy -p force-app/main/default/lwc -u myOrg
```

### 2. 基本的な使い方

```html
<template>
    <c-searchable-picklist
        options={options}
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
        const selected = event.detail.selectedOption;
        console.log('Selected:', selected);
    }
}
```

## デモの確認

デモコンポーネントをLightning App Builderで追加して動作を確認できます：

1. Lightning App Builderを開く
2. 「カスタム」から「searchablePicklistDemo」を追加
3. 検索機能と選択動作を確認

## 要件

- Salesforce API バージョン: 64.0以上
- Lightning Web Components対応組織

## ドキュメント

- [コンポーネントの詳細仕様](force-app/main/default/lwc/searchablePicklist/README.md)
- [要件定義書](requirements_definition/base_requirements.md)

## ライセンス

MIT License - 詳細は [LICENSE.txt](LICENSE.txt) を参照

## 参考資料

- [Salesforce Extensions Documentation](https://developer.salesforce.com/tools/vscode/)
- [Salesforce CLI Setup Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_setup.meta/sfdx_setup/sfdx_setup_intro.htm)
- [Salesforce DX Developer Guide](https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_intro.htm)
- [Lightning Web Components Developer Guide](https://developer.salesforce.com/docs/component-library/documentation/en/lwc)
