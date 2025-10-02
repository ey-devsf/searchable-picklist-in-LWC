import { LightningElement, track } from 'lwc';

export default class SearchablePicklistDemo extends LightningElement {
    @track selectedOption = null;
    
    // デフォルト値の設定（オプション）
    initValue = '';
    initSearchValue = '';
    
    // 選択肢のリストを定義
    options = [
        { label: 'りんご', value: 'apple' },
        { label: 'バナナ', value: 'banana' },
        { label: 'さくらんぼ', value: 'cherry' },
        { label: 'ぶどう', value: 'grape' },
        { label: 'キウイ', value: 'kiwi' },
        { label: 'レモン', value: 'lemon' },
        { label: 'マンゴー', value: 'mango' },
        { label: 'オレンジ', value: 'orange' },
        { label: 'もも', value: 'peach' },
        { label: 'なし', value: 'pear' },
        { label: 'パイナップル', value: 'pineapple' },
        { label: 'いちご', value: 'strawberry' },
        { label: 'すいか', value: 'watermelon' },
        { label: 'ブルーベリー', value: 'blueberry' },
        { label: 'ラズベリー', value: 'raspberry' },
        { label: 'あんず', value: 'apricot' },
        { label: 'アボカド', value: 'avocado' },
        { label: 'ココナッツ', value: 'coconut' },
        { label: 'いちじく', value: 'fig' },
        { label: 'グレープフルーツ', value: 'grapefruit' }
    ];
    
    handleOptionSelected(event) {
        this.selectedOption = event.detail.selectedOption;
        console.log('Selected option:', this.selectedOption);
        console.log('Input text:', event.detail.inputText);
    }
}
