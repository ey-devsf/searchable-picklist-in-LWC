# Searchable Picklist Component

検索機能付きのプルダウン選択コンポーネント（Lightning Web Component）

## 概要

このコンポーネントは、選択肢が多い場合に検索機能を提供するプルダウン形式のinput-boxです。最大800項目でも快適に使用できます。

## 特徴

- 検索機能付きプルダウン
- キーボードナビゲーション対応（Tab、矢印キー、Enter）
- 汎用的で他のLWCに埋め込み可能
- 親コンポーネントから選択肢を受け取り
- 完全一致時の自動選択
- 標準HTMLタグを使用（lightning-inputは不使用）

## 使用方法

### 基本的な使い方

```html
<c-searchable-picklist
    options={options}
    onoptionselected={handleOptionSelected}
></c-searchable-picklist>
```

### パラメータ

#### `options` (必須)
プルダウンの選択肢の配列。各オプションは以下のプロパティを持つ必要があります：
- `label` (必須): 表示されるラベル
- `value` (必須): 選択肢の値

```javascript
options = [
    { label: 'りんご', value: 'apple' },
    { label: 'バナナ', value: 'banana' },
    { label: 'さくらんぼ', value: 'cherry' }
];
```

任意のプロパティを追加することも可能です：
```javascript
options = [
    { label: 'りんご', value: 'apple', category: 'fruit', color: 'red' },
    { label: 'バナナ', value: 'banana', category: 'fruit', color: 'yellow' }
];
```

#### `initValue` (オプション)
デフォルトで選択したい値を指定します。

```html
<c-searchable-picklist
    options={options}
    init-value="apple"
></c-searchable-picklist>
```

#### `initSearchValue` (オプション)
デフォルトで検索ボックスに表示したい文字列を指定します。

```html
<c-searchable-picklist
    options={options}
    init-search-value="りんご"
></c-searchable-picklist>
```

### イベント

#### `optionselected`
選択肢が選択されたときに発火するイベント。

```javascript
handleOptionSelected(event) {
    const selectedOption = event.detail.selectedOption;
    const inputText = event.detail.inputText;
    
    console.log('Selected:', selectedOption);
    // { label: 'りんご', value: 'apple' }
}
```

### 公開メソッド

#### `getInputText()`
検索ボックスに入力された値を取得します。

```javascript
const picklist = this.template.querySelector('c-searchable-picklist');
const inputText = picklist.getInputText();
```

#### `getSelectedOption()`
現在選択されているオプションを取得します。

```javascript
const picklist = this.template.querySelector('c-searchable-picklist');
const selected = picklist.getSelectedOption();
```

## キーボードナビゲーション

### 検索ボックス
- **Tab / ↓**: 選択リストの最初の項目にフォーカス
- **Enter**: 検索結果が1件のみの場合、その項目を選択
- **Escape**: ドロップダウンを閉じる

### 選択リスト
- **Enter**: フォーカスされている項目を選択
- **↑**: 前の項目に移動（最上位で検索ボックスに戻る）
- **↓**: 次の項目に移動（最下位で検索ボックスに戻る）
- **Tab**: 次の項目に移動（最下位で検索ボックスに戻る）
- **Shift + Tab**: 前の項目に移動（最上位で検索ボックスに戻る）
- **Escape**: ドロップダウンを閉じて検索ボックスにフォーカス

## 動作詳細

### フォーカス時
- プルダウンの選択リストを表示
- 既に検索ワードが入力済みの場合、フィルタされた選択リストを表示

### 入力変更時
- 入力内容に応じて選択リストをリアルタイムでフィルタ

### フォーカスアウト時
- 選択リスト内にフォーカスが移動した場合：何もしない
- 選択リスト外にフォーカスが移動した場合：
  - 検索ワードと完全一致する選択肢が1件のみであれば自動選択
  - 選択リストを非表示

## デモコンポーネント

デモコンポーネント `searchablePicklistDemo` を使用して、動作を確認できます。

```bash
sfdx force:source:deploy -p force-app/main/default/lwc/searchablePicklistDemo
```

## 要件

- Salesforce API バージョン: 64.0以上
- Lightning Web Components対応

## ライセンス

MIT License
