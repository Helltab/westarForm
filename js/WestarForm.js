;(function (undefined) {
    'use strict'

    // var formConfig = new FormConfig()
    var strEnum = {
        OPTIONS: 'WESTAR_FORM_OPTIONS',
        SIZE: {
            A4: {
                LONG: 1569,
                SHORT: 1073
            }
        }, STYLE: {
            A4: 'A4',
            A3: 'A3'
        }, DIRECT: {
            H: 'H',
            V: 'V'
        },
        MODE: {
            NORMAL: 'normal', // 普通模式, 类似excel
            DRAG: 'drag', // 拖拽模式, 禁止编辑
            READ: 'read', // 只读模式, 禁止编辑和拖拽
        },
        INPUT_TYPE: {
            TEXT: 'text',
            RADIO: 'radio',
            CHECKBOX: 'checkbox',
            DATE: 'date',
            HAND: 'hand',
            CUSTOM: 'custom',
        },
        CEIL_ATTR: {
            DATA_MERGE: 'data-merge',
            DATA_FIELD: 'data-field',
            DATA_FIELD_TYPE: 'data-fieldtype',
            CONTENTEDITABLE: 'contenteditable',
            FIELD_TYPE: 'fieldType',
            FIELD_DATA: 'fieldData',
            PLACEHOLDER: 'placeholder',
        },
        CONTENTEDITABLE_PROP: {
            PLAINTEXT: 'plaintext-only',
            EVENTS: 'events',
            CARET: 'caret',
            TRUE: 'true',
            FALSE: 'false',
        },
        CLASS_NAME: {
            FORM_BODY: 'westar_form_body',
            DRAG_BODY: 'westar_drag_body',
            DRAG_MODE: 'westar_mode_drag',
            READ_MODE: 'westar_mode_read',
            TABLE: 'westar_form',
            DRAG_WRAP: 'westar_drag_wrap',
            FORM_WRAP: 'westar_form_wrap',
            PAGE_WRAP: 'westar_page_wrap',
            FIELD_WRAP: 'westar_form_field_wrap',
            DATE_WRAP: 'westar_field_date_wrap',
            HAND_WRAP: 'westar_field_hand_wrap',
            DRAG_SEARCH: 'westar_drag_search',
            DRAG_LIST: 'westar_drag_list',
            FORM_PAGE: 'westar_form_page',
            PAGE_TEXT: 'westar_form_page_text',
            PAGE_AFTER: 'westar_form_paged_after', // 之后分页
            PAGE_BEFORE: 'westar_form_paged_before', // 之前分页
            FORM_CEIL: 'westar_form_ceil',
            FLOT_LEFT: 'westar_form_float_left',
            NONE_BACK: 'westar_form_none_back',
            PRE: 'westar_form_',
            TR_BORDER: 'westar_form_tr_border',
            AREA: 'westar_form_area',
            CURRENT: 'westar_form_current',
            HIDE: 'westar_form_hide',
            MERGE: 'westar_form_merge',
            MASK: 'westar_form_mask',
            EDIT_DIV: 'westar_form_edit_div',
            INPUT_TEXT: 'westar_form_input_text',
            MENU_BODY: 'westar_form_menu_body',
            MENU_CHILD: 'westar_form_menu_child',
            NO_PRINT: 'westar_form_no_print',
            CHECK_BOX: 'westar_form_check_box',
        },
        ID_NAME: {
            ROOT_ID: 'westarForm',
            STYLE: 'westar_form_style',
            TITLE: 'westar_form_title',
            PRINT_STYLE: 'westar_form_print_style',
            PRINT_STYLE_ADD: 'westar_form_print_style_add',
            LESS: 'westar_form_style_less',
            MENU: 'westar_form_menu',
            MASK: 'westar_form_mask',
            CHECK_MASK: 'westar_check_mask',
            MODAL: 'westar_form_modal',
            INPUT_TEXT: 'westar_form_input_text',
            ADD_TEXT: 'westar_form_add_text',
            HIDE_MODAL: 'westar_form_hide_modal',
        }
    }
    /**
     * 模板方法
     * @type {{[p: string]: {org: function(*=, *=): void, target: function(*, *)}|{org: function(*=, *=): void, target: function(*, *)}}}
     */
    const FIELD_TEMPLATE = {
        // 普通字段
        [strEnum.INPUT_TYPE.TEXT]: {
            org: (dragWrap, field) => {
                let kvMap = genOrgEle(dragWrap, field)
                kvMap.v.innerText = field.title + ': 输入区'
            },
            target: (ele, info) => {
                let field = info.data
                if (info.type === 'value') {
                    setEditable(ele)
                    ele.setAttribute(strEnum.CEIL_ATTR.PLACEHOLDER, field.title + ' :输入区')
                    ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD_TYPE, strEnum.INPUT_TYPE.TEXT)
                } else if (info.type === 'key') {
                    ele.innerHTML = field.title
                }
                ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD, JSON.stringify(info))
                setEditMap(ele)
            },
            fill: (ele, name, value) => {
                if (value !== undefined) {
                    ele.innerText = value
                }
            },
            getData: (ele) => {
                return ele.innerText
            }
        },
        // radio
        [strEnum.INPUT_TYPE.RADIO]: {
            org: (ele, field) => {
                let kvMap = genOrgEle(ele, field)
                let opts = field.options.split('^')
                let html = ''
                opts.forEach(opt => {
                    html +=
                        `
                        <div class="${strEnum.CLASS_NAME.FIELD_WRAP}">
                         <input type="radio" id="${field.name}-${opt}" name="${field.name}" value="${opt}"/>
                         <label for="${field.name}-${opt}">${opt}</label>
                        </div>
                        `
                })
                kvMap.v.innerHTML = html
            },
            target: (ele, info) => {
                let field = info.data
                if (info.type === 'value') {
                    let opts = field.options.split('^')
                    let html = ''
                    opts.forEach(opt => {
                        html +=
                            `
                        <div class="${strEnum.CLASS_NAME.FIELD_WRAP}">
                            <input type="radio" id="${field.name}-${opt}" name="${field.name}" value="${opt}"/>
                            <label for="${field.name}-${opt}">${opt}</label>
                        </div>
                        `
                    })
                    ele.innerHTML = html
                    ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD_TYPE, strEnum.INPUT_TYPE.RADIO)
                } else if (info.type === 'key') {
                    ele.innerText = field.title
                }
                setEditMap(ele)
                ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD, JSON.stringify(info))
            },
            fill: (ele, name, value) => {
                for (let r of document.getElementById(strEnum.CLASS_NAME.FORM_BODY).querySelectorAll(`[name=${name}]`)) {
                    r.value === value
                        ? r.setAttribute('checked', '')
                        : r.removeAttribute('checked')
                }
            },
            getData: (ele, name) => {
                let r = document.getElementById(strEnum.CLASS_NAME.FORM_BODY).querySelector(`[name=${name}]:checked`)
                return r ? r.value : null
            }
        },
        // checkbox
        [strEnum.INPUT_TYPE.CHECKBOX]: {
            org: (ele, field) => {
                let kvMap = genOrgEle(ele, field)
                let opts = field.options.split('^')
                let html = ''
                opts.forEach(opt => {
                    html +=
                        `
                        <div class="${strEnum.CLASS_NAME.FIELD_WRAP}">
                         <input type="checkbox" id="${field.name}-${opt}" name="${field.name}" value="${opt}"/>
                         <label for="${field.name}-${opt}">${opt}</label>
                        </div>
                        `
                })
                kvMap.v.innerHTML = html
            },
            target: (ele, info) => {
                let field = info.data
                if (info.type === 'value') {
                    let opts = field.options.split('^')
                    let html = ''
                    opts.forEach(opt => {
                        html +=
                            `
                        <div class="${strEnum.CLASS_NAME.FIELD_WRAP}">
                            <input type="checkbox" id="${field.name}-${opt}" name="${field.name}" value="${opt}"/>
                            <label for="${field.name}-${opt}">${opt}</label>
                        </div>
                        `
                    })
                    ele.innerHTML = html
                    ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD_TYPE, strEnum.INPUT_TYPE.CHECKBOX)
                } else if (info.type === 'key') {
                    ele.innerText = field.title
                }
                setEditMap(ele)
                ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD, JSON.stringify(info))
            },
            fill: (ele, name, value) => {
                for (let c of document.getElementById(strEnum.CLASS_NAME.FORM_BODY).querySelectorAll(`[name=${name}]`)) {
                    c.value === value
                        ? c.setAttribute('checked', '')
                        : c.removeAttribute('checked')
                }
            },
            getData: (ele, name) => {
                let result = ''
                for (let c of document.getElementById(strEnum.CLASS_NAME.FORM_BODY).querySelectorAll(`[name=${name}]:checked`)) {
                    result += c.value + ","
                }
                return result
            }
        },
        // date
        [strEnum.INPUT_TYPE.DATE]: {
            org: (ele, field) => {
                let kvMap = genOrgEle(ele, field)
                let html =
                    `
                        <div class="${strEnum.CLASS_NAME.DATE_WRAP}">
                            <div></div>
                             <label>年</label>
                            <div></div>
                             <label>月</label>
                            <div></div>
                             <label>日</label>
                        </div>
                        `
                kvMap.v.innerHTML = html
            },
            target: (ele, info) => {
                let field = info.data
                if (info.type === 'value') {
                    let html =
                        `
                        <div class="${strEnum.CLASS_NAME.DATE_WRAP}">
                            <div id="${field.name}-year" contenteditable="${strEnum.CONTENTEDITABLE_PROP.PLAINTEXT}" ></div>
                             <label for="${field.name}-year">年</label>
                            <div id="${field.name}-month" contenteditable="${strEnum.CONTENTEDITABLE_PROP.PLAINTEXT}" ></div>
                             <label for="${field.name}-month">月</label>
                            <div id="${field.name}-day" contenteditable="${strEnum.CONTENTEDITABLE_PROP.PLAINTEXT}" ></div>
                             <label for="${field.name}-day">日</label>
                        </div>
                        `
                    ele.innerHTML = html
                    ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD_TYPE, strEnum.INPUT_TYPE.DATE)
                } else if (info.type === 'key') {
                    ele.innerText = field.title
                }
                setEditMap(ele)
                ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD, JSON.stringify(info))
            },
            fill: (ele) => {
                return
            },
            getData: (ele) => {
                return null
            }
        },
        // hand 手填的部分
        [strEnum.INPUT_TYPE.HAND]: {
            org: (ele, field) => {
                let kvMap = genOrgEle(ele, field)
                let html =
                    `
                        <div class="${strEnum.CLASS_NAME.FIELD_WRAP}">
                            例如=>"签名: 日期: "
                        </div>
                        `
                kvMap.v.innerHTML = html
            },
            target: (ele, info) => {

                let field = info.data
                if (info.type === 'value') {
                    let html =
                        `
                           <div placeholder="点击修改手填内容脚注" contenteditable="${strEnum.CONTENTEDITABLE_PROP.PLAINTEXT}" ></div>
                        `
                    ele.classList.add(strEnum.CLASS_NAME.HAND_WRAP)
                    ele.innerHTML = html
                    ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD_TYPE, strEnum.INPUT_TYPE.HAND)
                } else if (info.type === 'key') {
                    ele.setAttribute(strEnum.CEIL_ATTR.PLACEHOLDER, "点击修改手填内容标题")
                    ele.classList.add(strEnum.CLASS_NAME.NONE_BACK)
                    setEditable(ele)
                }
                setEditMap(ele)
                ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD, JSON.stringify(info))
            },
            fill: (ele) => {
                return
            },
            getData: (ele) => {
                return null
            }
        },
        // 自定义输入框
        [strEnum.INPUT_TYPE.CUSTOM]: {
            org: (ele, field) => {
                let kvMap = genOrgEle(ele, field)
                let html =
                    `
                        <div class="${strEnum.CLASS_NAME.FIELD_WRAP}">
                           自定义输入区
                        </div>
                        `
                kvMap.v.innerHTML = html
            },
            target: (ele, info) => {
                let field = info.data
                if (info.type === 'value') {
                    setEditable(ele)
                    ele.setAttribute(strEnum.CEIL_ATTR.PLACEHOLDER, field.title + ' :输入区')
                    ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD_TYPE, strEnum.INPUT_TYPE.TEXT)
                } else if (info.type === 'key') {
                    ele.setAttribute(strEnum.CEIL_ATTR.PLACEHOLDER, "点击修改自定义标题")
                    ele.classList.add(strEnum.CLASS_NAME.NONE_BACK)
                    setEditable(ele)
                }
                ele.setAttribute(strEnum.CEIL_ATTR.DATA_FIELD, JSON.stringify(info))
                setEditMap(ele)
            },
            fill: (ele) => {
                return
            },
            getData: (ele) => {
                return null
            }
        },
    }

    /**
     * 坐标类
     * @param {Object} arr
     */
    function FormPoint(arr) {
        this.x = arr[0];
        this.y = arr[1];
    }

    FormPoint.prototype = {
        setPoint: function (arr) {
            this.x = arr[0];
            this.y = arr[1];
        },
        setX: function (x) {
            this.x = x;
        },
        setY: function (y) {
            this.y = y;
        },
    }

    /**
     * @param {Object} config 表格配置类
     */
    function FormConfig(config) {
        if (!config) {
            return;
        }
        this.mergeMap = config.mergeMap;
        this.attrMap = config.attrMap;
        this.classList = config.classList || {};
        this.edit = config.edit;
    }

    FormConfig.prototype = {
        setMergeMap: function (mergeMap) {
            this.mergeMap = mergeMap
        },
        setEdit: function (edit) {
            this.edit = edit
        }
    }

    /**
     * 新建一个表格
     */
    function genForm() {
        let formBody = document.getElementById(strEnum.CLASS_NAME.FORM_BODY);
        let tableSize = getTableSize()
        let wrap = document.createElement('DIV');
        wrap.classList.add(strEnum.CLASS_NAME.FORM_WRAP);
        wrap.classList.id = strEnum.CLASS_NAME.FORM_WRAP;
        wrap.classList.add('westar_form_' + options.style + '_' + options.direction)
        document.getElementById(strEnum.ID_NAME.TITLE).style.height = tableSize.titleH + 'px'
        for (let p = 0; p < options.pages; p++) {
            let pageWap = document.createElement('DIV');
            let pageText = document.createElement('P');
            pageWap.classList.add(strEnum.CLASS_NAME.PAGE_WRAP)
            pageWap.style.gridTemplateColumns = `repeat(${tableSize.ceilNum}, ${tableSize.ceilSize}px)`;
            pageWap.style.gridTemplateRows = `repeat(${tableSize.ceilNum2},  ${tableSize.ceilSize}px)`;
            pageWap.style.width = `${tableSize.width}px`;
            pageWap.style.height = `${tableSize.height}px`;
            pageText.classList.add(strEnum.CLASS_NAME.PAGE_TEXT);
            let ceilNumV = tableSize.ceilNum2;
            let ceilNumH = tableSize.ceilNum;
            if (p === 0) {
                ceilNumV = Math.floor((tableSize.height - tableSize.titleH) / tableSize.ceilSize) - 1
            }
            for (let i = 0; i < ceilNumV; i++) {
                for (let j = 0; j < ceilNumH; j++) {
                    let ceil = document.createElement('DIV');
                    ceil.classList.add(strEnum.CLASS_NAME.FORM_CEIL);
                    ceil.classList.add(strEnum.CLASS_NAME.FORM_CEIL);
                    ceil.id = `ceil_${p}_${i}_${j}`;
                    pageWap.appendChild(ceil);
                }
            }
            pageText.innerHTML = (p + 1) + '/' + options.pages;
            // 设置分页标记
            let afterPaged = document.createElement('br');
            afterPaged.classList.add(strEnum.CLASS_NAME.PAGE_AFTER)
            pageWap.append(pageText);
            wrap.appendChild(pageWap);
            wrap.appendChild(afterPaged);
        }
        formBody.appendChild(wrap);
        setTimeout(function () {
            switch (options.mode) {
                case strEnum.MODE.NORMAL: {
                    document.addEventListener('mousedown', onMouseDown, false); //事件会在鼠标按键被按下时发生。
                    document.addEventListener('mouseup', onMouseUp, false); //事件会在鼠标按键被按下时发生。
                    document.addEventListener('dblclick', dbClick, false); //事件会在鼠标按键被按下时发生。
                    break;
                }
                case strEnum.MODE.DRAG: {
                    let targetTemp = null
                    matrixClass(strEnum.CLASS_NAME.FORM_CEIL, ceil => {
                        formBody.addEventListener('mousedown', onMouseDown, false); //事件会在鼠标按键被按下时发生。
                        formBody.addEventListener('mouseup', onMouseUp, false); //事件会在鼠标按键被按下时发生。
                        ceil.addEventListener('dragover', event => {
                            if (!isCeil(event.target)) return
                            event.preventDefault();
                            let tempELe = event.target
                            targetTemp = tempELe
                            setTimeout(() => {
                                if (targetTemp && targetTemp === tempELe) {
                                    setCurrent(tempELe)
                                }
                            }, 200)
                        });
                        ceil.addEventListener('drop', event => {
                            if (!isCeil(event.target)) return
                            event.preventDefault();
                            event.target.classList.remove(strEnum.CLASS_NAME.EDIT_DIV)
                            event.target.classList.remove(strEnum.CLASS_NAME.NONE_BACK)
                            event.target.classList.remove(strEnum.CLASS_NAME.HAND_WRAP)
                            event.target.removeAttribute(strEnum.CEIL_ATTR.CONTENTEDITABLE)
                            event.target.innerHTML = null
                            let info = event.dataTransfer.getData(strEnum.CEIL_ATTR.FIELD_DATA)
                            let inputType = event.dataTransfer.getData(strEnum.CEIL_ATTR.DATA_FIELD_TYPE)
                            FIELD_TEMPLATE[inputType].target(event.target, JSON.parse(info))
                        });
                    })
                    break;
                }
                default:
                    break;
            }

        }, 10);

    }

    /**
     * 加载一个存在的表单配置
     */
    function loadForm() {
        // 生成表单
        genForm()
        // 生成拖拽列表
        genDrag()
        // 加载配置
        loadFormConfig()
        // 设置为已读
        setRead()
        // 根据模式进行事件初始化
        setMode()
        // 根据已有的数据填充对应的字段
        fillField()
    }

    function setRead() {
        if (isRead()) {
            // 去掉当前活动单元格
            clearClassName(strEnum.CLASS_NAME.CURRENT, () => {
                options.currentCeil = null
            })
            // 把手写的内容变为只读
            for (const ele of document.getElementsByClassName(strEnum.CLASS_NAME.HAND_WRAP)) {
                console.log(ele);
                ele.childNodes.forEach(c => {
                    try {
                        c.setAttribute(strEnum.CEIL_ATTR.CONTENTEDITABLE, strEnum.CONTENTEDITABLE_PROP.FALSE)
                    } catch (e) {
                    }
                })

            }
        }
        if (options.ifPrint) {
            matrixClass(strEnum.CLASS_NAME.FORM_CEIL, ceil => {
                if (ceil.hasAttribute(strEnum.CEIL_ATTR.CONTENTEDITABLE)) {
                    ceil.removeAttribute(strEnum.CEIL_ATTR.CONTENTEDITABLE)
                }
            })
        }

    }

    /**
     * 根据已有的数据填充对应的字段
     * 传入的数据应该是 {name, value} 这样的格式
     */
    function fillField(fieldValueMap = options.fieldValueMap) {
        console.log(fieldValueMap)
        matrixAttr(strEnum.CEIL_ATTR.DATA_FIELD, ele => {
            let dataField = ele.getAttribute(strEnum.CEIL_ATTR.DATA_FIELD)
            let jsonData = JSON.parse(dataField)
            let data = jsonData.data
            let v = fieldValueMap[data.name]
            if (v !== undefined && jsonData.type === 'value') {
                FIELD_TEMPLATE[data.inputType].fill(ele, data.name, v)
            }
        })
    }

    function getFieldMap() {
        let result = {}
        matrixAttr(strEnum.CEIL_ATTR.DATA_FIELD, ele => {
            let dataField = ele.getAttribute(strEnum.CEIL_ATTR.DATA_FIELD)
            let jsonData = JSON.parse(dataField)
            let data = jsonData.data
            if (jsonData.type === 'value') {
                let v = FIELD_TEMPLATE[data.inputType].getData(ele, data.name)
                if (v) result[data.name] = v
            }
        })
        return JSON.stringify(result)
    }

    /**
     * 设置模式
     */
    function setMode() {
        let bodyClassList = document.getElementById(strEnum.CLASS_NAME.FORM_BODY).classList;
        switch (options.mode) {
            case strEnum.MODE.NORMAL: {
                bodyClassList.remove(strEnum.CLASS_NAME.READ_MODE);
                bodyClassList.remove(strEnum.CLASS_NAME.DRAG_MODE);
                break;
            }
            case strEnum.MODE.DRAG: {
                bodyClassList.remove(strEnum.CLASS_NAME.READ_MODE);
                bodyClassList.add(strEnum.CLASS_NAME.DRAG_MODE);
                break;
            }
            case strEnum.MODE.READ: {
                bodyClassList.remove(strEnum.CLASS_NAME.DRAG_MODE);
                bodyClassList.add(strEnum.CLASS_NAME.READ_MODE);
                break;
            }
            default:
        }
    }

    /**
     * 拖拽框初始化
     * 说明:
     * 1. 字段列表: fieldList, 从服务器获取
     * 2. 功能描述: 每个字段分为两个部分, k 为字段属性, v 为字段值, 必须将两个部分都设置到表格中, 并且不能重复
     */
    function genDrag() {
        if (options.mode !== strEnum.MODE.DRAG) {
            document.getElementById(strEnum.CLASS_NAME.DRAG_BODY).classList.add(strEnum.CLASS_NAME.HIDE)
            return
        }
        console.log('options', options)
        let fieldListMap = processFieldList(options.fieldList)
        let dragList = document.getElementById(strEnum.CLASS_NAME.DRAG_LIST);
        dragList.innerHTML = null
        for (const key in strEnum.INPUT_TYPE) {
            let type = strEnum.INPUT_TYPE[key]
            fieldListMap[type].forEach(field => {
                let dragWrap = document.createElement("DIV");
                dragWrap.innerHTML = `<i class="fa fa-hand-o-right" aria-hidden="true"></i>`
                dragWrap.classList.add(strEnum.CLASS_NAME.DRAG_WRAP);
                dragList.appendChild(dragWrap)
                if (typeof FIELD_TEMPLATE[type].org === "function") {
                    FIELD_TEMPLATE[type].org(dragWrap, field)
                }
            })
        }
    }

    function processFieldList(list) {

        let result = {}
        let types = ['text', 'textarea', 'select', 'checkbox', 'date', 'radio']
        for (const typesKey in strEnum.INPUT_TYPE) {
            let type = strEnum.INPUT_TYPE[typesKey]
            // 处理字段的类型
            result[type] = []
        }
        let search = document.getElementById(strEnum.CLASS_NAME.DRAG_SEARCH).value
       if(list) {
           list.filter(
               item => {
                   return !search || item.title.indexOf(search) !== -1
               }
           ).forEach(item => {
               if (types.indexOf(item.inputType) === -1) return
               if (item.inputType === 'textarea') item.inputType = strEnum.INPUT_TYPE.TEXT
               else if (item.inputType === 'select') item.inputType = strEnum.INPUT_TYPE.RADIO
               result[item.inputType].push(new FieldLib(item))
           })
       }
        result[strEnum.INPUT_TYPE.HAND] = [
            new FieldLib({inputType:  strEnum.INPUT_TYPE.HAND, name: 'handwrite', title: '手写框', options: ''}),
        ]
        result[strEnum.INPUT_TYPE.CUSTOM] = [
            new FieldLib({inputType:  strEnum.INPUT_TYPE.CUSTOM, name: 'custom' + Date.now(), title: '自定义输入框', options: ''}),
        ]
        return result
    }

    /**
     * 生成键值对标签
     * @param ele
     * @return {{v: HTMLElement, k: HTMLElement}}
     */
    function genOrgEle(ele, field) {
        let k_ele = document.createElement("DIV")
        k_ele.setAttribute("draggable", "true")
        k_ele.classList.add("westar_drag_k")
        k_ele.innerText = field.title
        let v_ele = document.createElement("DIV")
        v_ele.setAttribute("draggable", "true")
        v_ele.classList.add("westar_drag_v")
        ele.appendChild(k_ele)
        ele.appendChild(v_ele)
        k_ele.addEventListener('dragstart', event => {
            event.dataTransfer.setData(strEnum.CEIL_ATTR.DATA_FIELD_TYPE, field.inputType);
            event.dataTransfer.setData(strEnum.CEIL_ATTR.FIELD_DATA, JSON.stringify({type: 'key', data: field}));
        });
        v_ele.addEventListener('dragstart', event => {
            event.dataTransfer.setData(strEnum.CEIL_ATTR.DATA_FIELD_TYPE, field.inputType);
            event.dataTransfer.setData(strEnum.CEIL_ATTR.FIELD_DATA, JSON.stringify({type: 'value', data: field}));
        });
        return {k: k_ele, v: v_ele}
    }

    /**
     * 字段类
     * @param obj
     * @constructor
     */
    function FieldLib(obj) {
        for (const prop in obj) {
            if (prop === 'name') this.name = obj[prop];
            else if (prop === 'title') this.title = obj[prop];
            else if (prop === 'options') this.options = obj[prop];
            else if (prop === 'inputType') this.inputType = obj[prop];
        }
    }

    /**
     * 鼠标移动
     * @param event {Object}
     */
    function onMouseMove(event) {
        options.finalCeil = event.target;
        if (isCeil(event.target)) {
            if (options.currentPage != getLocation(options.finalCeil)[0]) {
                return
            }
            setMinMax()
            clearClassName(strEnum.CLASS_NAME.AREA)
            renderSelect()
        }
    }

    /**
     * 判断是否是单元格
     */
    function isCeil(ele) {
        if (!ele) return false
        return ele.classList.contains(strEnum.CLASS_NAME.FORM_CEIL);
    }


    /**
     * 鼠标移出
     */
    function onMouseUp() {
        options.onMove = false
        document.getElementById(strEnum.CLASS_NAME.FORM_BODY)
            .removeEventListener('mousemove', onMouseMove, false)
        options.movable = null;
    }

    /**
     * 移除可编辑的 div
     */
    function clearEditDiv() {
        if (options.mode === strEnum.MODE.NORMAL) clearClassName(strEnum.CLASS_NAME.CURRENT, readOnly)
    }

    /**
     * 鼠标按下
     * @param {Object} event
     */
    function onMouseDown(event) {
        options.onMove = false
        if (event.button == 2) {
            return
        }
        let ele = event.target;
        if (!isCeil(ele)) return;
        if (options.currentCeil === ele) {
            options.movable = document.getElementById(strEnum.CLASS_NAME.FORM_BODY)
                .addEventListener('mousemove', onMouseMove, false); //事件会在鼠标指针移动时发生。
            return;
        }
        clearClassName(strEnum.CLASS_NAME.AREA);
        clearEditDiv(ele);
        if (!options.currentCeil) {
            setCurrent(ele)
            let location = getLocation(options.currentCeil)
            setCurCeil(location)
        } else if (ele != options.currentCeil) {
            let location = getLocation(options.currentCeil)
            setCurrent(ele)
            setCurCeil(location)
        }
        options.movable = document.getElementById(strEnum.CLASS_NAME.FORM_BODY)
            .addEventListener('mousemove', onMouseMove, false); //事件会在鼠标指针移动时发生。
    }

    function setCurCeil(location) {
        options.first.setPoint(location.slice(1, 3))
        options.last.setPoint(location.slice(1, 3))
        options.currentPage = location[0];
        options.finalCeil = options.currentCeil;
        setMinMax(null);
    }

    function setCurrent(ele) {
        clearClassName(strEnum.CLASS_NAME.CURRENT)
        ele.classList.add(strEnum.CLASS_NAME.CURRENT)
        options.currentCeil = ele
    }

    /**
     * 合并单元格
     */
    function merge() {
        if (options.selectNum < 0) {
            alert("未选择任何单元格")
            return
        }
        if (options.selectNum < 2) return
        if (!!options.finalCeil) {
            let key = getIdentify([options.currentPage, options.first.x, options.first.y])
            let cur = document.getElementById(key)
            // 将这个合并单元格的两个顶格加入 map
            let formConfig = options.dataMap[key] || new FormConfig({});
            let tempData = cur.innerHTML;
            matrixFun(function (i, j) {
                let tempKey = getIdentify([options.currentPage, i, j])
                if (!!options.dataMap[tempKey]) {
                    let mergeMap = options.dataMap[tempKey].mergeMap;
                    if (!!mergeMap && Object.keys(mergeMap).length > 0) {
                        // 如果遇到合并的单元格, 直接取消其中的记录
                        options.dataMap[tempKey].mergeMap = null
                    }
                }
                let ele = document.getElementById(tempKey);
                ele.innerHTML = ''
                mergeFlag(ele, true)
                ele.setAttribute(strEnum.CEIL_ATTR.DATA_MERGE, key)
            })
            formConfig.setMergeMap({
                first: new FormPoint([options.first.x, options.first.y]),
                last: new FormPoint([options.last.x, options.last.y])
            })
            options.dataMap[key] = formConfig
            // 将合并后的单元格显示出来, 添加 colspan 和 rowspan
            cur.classList.remove(strEnum.CLASS_NAME.HIDE);
            cur.innerHTML = tempData
            mergeCeil(cur, options.last.y - options.first.y + 1, options.last.x - options.first.x + 1)
            clearClassName(strEnum.CLASS_NAME.AREA)
        }
    }

    /**
     * 合并单元格
     * @param ele 合并的第一个元素
     * @param columns 横向个数
     * @param rows 纵向个数
     */
    function mergeCeil(ele, columns, rows) {
        let location = getLocation(ele)
        ele.style.gridColumnStart = parseInt(location[2]) + 1
        ele.style.gridColumnEnd = `span ${columns}`
        ele.style.gridRowStart = parseInt(location[1]) + 1
        ele.style.gridRowEnd = `span ${rows}`
        options.selectNum = 1
    }

    /**
     * 加载配置
     */
    function loadFormConfig() {
        // 合并单元格
        let formConfigMap = options.dataMap;
        for (let key in formConfigMap) {
            let page = key.split('_')[1];
            let elem = document.getElementById(key);
            if (!!elem) {
                let formConfig = formConfigMap[key];
                let mergeMap = formConfig.mergeMap;
                for (let clazz in formConfig.classList) {
                    elem.classList.add(formConfig.classList[clazz]);
                }
                if (!!mergeMap) {
                    let flag = getIdentify([page, mergeMap.first.x, mergeMap.first.y])
                    matrixFun(function (i, j) {
                        let ele = document.getElementById(getIdentify([page, i, j]));
                        mergeFlag(ele, true)
                        ele.setAttribute(strEnum.CEIL_ATTR.DATA_MERGE, flag)
                    }, mergeMap)
                    // 将合并后的单元格显示出来
                    elem.classList.remove(strEnum.CLASS_NAME.HIDE);
                    mergeCeil(elem, mergeMap.last.y - mergeMap.first.y + 1, mergeMap.last.x - mergeMap.first.x + 1)
                }
                elem.innerHTML = formConfig.edit;
                let attrMap = formConfig.attrMap;
                for (const attr in attrMap) {
                    elem.setAttribute(attr, attrMap[attr])
                }
                if (!!attrMap && attrMap[strEnum.CEIL_ATTR.DATA_FIELD_TYPE] === strEnum.INPUT_TYPE.TEXT) {
                    setEditable(elem)
                }
            }
        }
        // 添加活动单元格
        setCurrent(document.getElementById("ceil_0_0_0"))
    }

    /**
     * 遍历所有的 td, 清除指定的 class
     * @param {String} className
     */
    function clearClassName(className, otherDo) {
        matrixClass(strEnum.CLASS_NAME.FORM_CEIL, ceil => {
            if (ceil.classList.contains(className)) {
                ceil.classList.remove(className);
                if (typeof otherDo == "function") {
                    otherDo(ceil);
                }
            }
        })
    }

    /**
     * 取消合并单元格
     */
    function mergeRollback() {
        // 先遍历看看是否包括了合并的单元格
        matrixFun(function (i, j) {
            let now = document.getElementById(getIdentify([options.currentPage, i, j]));
            if (now.classList.contains(strEnum.CLASS_NAME.MERGE)) {
                setMinMax(now)
            }
        })
        // 再次遍历取消合并单元格
        matrixFun(function (i, j) {
            let key = getIdentify([options.currentPage, i, j])
            let ele = document.getElementById(key);
            mergeFlag(ele, false);
            ele.style.gridArea = '';
            if (!!options.dataMap[key]) {
                options.dataMap[key].mergeMap = null
            }
        })
    }

    /**
     * 遍历所选择的顶格坐标包含的所有单元格
     * @param {Object} todo 遍历操作
     */
    function matrixFun(todo, mergeMap = options) {
        for (var i = mergeMap.first.x; i <= mergeMap.last.x; i++) {
            for (var j = mergeMap.first.y; j <= mergeMap.last.y; j++) {
                todo(i, j);
            }
        }
    }

    /**
     * 遍历所有包含指定 class 的元素
     * @param {Object} todo 遍历操作
     */
    function matrixClass(className, todo) {
        for (let ceil of document.getElementsByClassName(className)) {
            todo(ceil)
        }
    }

    /**
     * 遍历所有包含指定 class 的元素
     * @param {Object} todo 遍历操作
     */
    function matrixAttr(attrName, todo) {
        for (let ele of document.querySelectorAll(`[${attrName}]`)) {
            todo(ele)
        }
    }

    /**
     * @param {Object} ele 合并操作的对象
     * @param {Object} flag 合并或者是取消合并
     */
    function mergeFlag(ele, flag) {
        if (flag) {
            ele.classList.add(strEnum.CLASS_NAME.HIDE)
            ele.classList.add(strEnum.CLASS_NAME.MERGE)
        } else {
            ele.classList.remove(strEnum.CLASS_NAME.HIDE)
            ele.classList.remove(strEnum.CLASS_NAME.MERGE)
            ele.removeAttribute(strEnum.CEIL_ATTR.DATA_MERGE)
        }
    }

    /**
     * 获取元素的定位, 根据设定好的 id 的二维数组来
     * @param {Object} ele
     */
    function getLocation(ele) {
        if (!ele || !ele.id) console.log('getLocation Err', ele)
        return ele.id.split("_").splice(1, 4)
    }

    /**
     * @param {Object} ele 设置对角线的顶格坐标
     */
    function setMinMax(ele) {
        // 获取
        let tempFinal = getLocation(options.finalCeil).slice(1, 3);
        let tempCur = getLocation(options.currentCeil).slice(1, 3);
        // 根据起始点和最后的落点来生成顶格坐标
        if (options.onMove) {
            options.first.setPoint([Math.min(tempCur[0], tempFinal[0], options.first.x), Math.min(tempCur[1], tempFinal[1], options.first.y)])
            options.last.setPoint([Math.max(tempCur[0], tempFinal[0], options.last.x), Math.max(tempCur[1], tempFinal[1], options.last.y)])
        } else {
            options.first.setPoint([Math.min(tempCur[0], tempFinal[0]), Math.min(tempCur[1], tempFinal[1])])
            options.last.setPoint([Math.max(tempCur[0], tempFinal[0]), Math.max(tempCur[1], tempFinal[1])])
        }
        // 如果遇到合并的单元格, 需要通过起始点/最后的落点/和合并的单元格的顶格来计算
        if (!!ele && ele.hasAttribute(strEnum.CEIL_ATTR.DATA_MERGE)) {
            options.onMove = true
            let key = ele.getAttribute(strEnum.CEIL_ATTR.DATA_MERGE);
            let location = options.dataMap[key].mergeMap;
            if (inArea(location.first, options.first, options.last) && inArea(location.last, options.first, options.last)) {
                return
            }
            options.first.setX(Math.min(location.first.x, options.first.x, tempCur[0], tempFinal[0]))
            options.first.setY(Math.min(location.first.y, options.first.y, tempCur[1], tempFinal[1]))
            options.last.setX(Math.max(location.last.x, options.last.x, tempCur[0], tempFinal[0]))
            options.last.setY(Math.max(location.last.y, options.last.y, tempCur[1], tempFinal[1]))
            matrixFun(function (i, j) {
                let newEle = document.getElementById(getIdentify([options.currentPage, i, j]))
                if (ele !== newEle && newEle.hasAttribute(strEnum.CEIL_ATTR.DATA_MERGE)) setMinMax(newEle)
            })
        }
    }

    /**
     * 判断某个 id 是否在区域内
     * @return {boolean}
     * @param point{FormPoint}
     * @param firstP{FormPoint}
     * @param lastP{FormPoint}
     */
    function inArea(point, firstP, lastP) {
        return point.x >= firstP.x
            && point.x <= lastP.x
            && point.y >= firstP.y
            && point.y <= lastP.y
    }

    /**
     * 双击添加编辑
     * @param {Object} event
     */
    function dbClick(event) {
        addEdit(event.target)
    }

    /**
     * 添加编辑
     * @param {Object} ele
     */
    function addEdit(ele) {
        if (options.mode !== strEnum.MODE.NORMAL) return
        if (!ele) ele = options.currentCeil
        if (isCeil(ele)) {
            setEditMap(ele)
            setEditable(ele)
            ele.focus();
            ele.addEventListener('input', inputHandle, false)
            ele.addEventListener('blur', () => {
                ele.removeEventListener('input', inputHandle, false)
            })
        }
    }

    function setEditMap(ele) {
        let key = getIdentify(getLocation(ele));
        let formConfig = options.dataMap[key] || new FormConfig({});
        formConfig.setEdit(ele.innerHTML);
        options.dataMap[key] = formConfig
    }

    /**
     * 使指定元素变成可编辑状态
     * @param ele
     * @param placeholder
     */
    function setEditable(ele, placeholder) {
        ele.classList.add(strEnum.CLASS_NAME.EDIT_DIV);
        ele.setAttribute(strEnum.CEIL_ATTR.CONTENTEDITABLE, strEnum.CONTENTEDITABLE_PROP.PLAINTEXT);
        if (!!placeholder) {
            ele.setAttribute(strEnum.CEIL_ATTR.PLACEHOLDER, placeholder)
        }
    }

    /**
     * 使某元素不可编辑
     * @param ele
     */
    function setUneditable(ele) {
        try {
            ele.classList.remove(strEnum.CLASS_NAME.EDIT_DIV);
            ele.removeAttribute(strEnum.CEIL_ATTR.CONTENTEDITABLE);
        } catch (e) {

        }

    }

    function inputHandle(ele) {
        setTimeout(() => {

        }, 300)
    }

    /**
     * 移除编辑
     */
    function removeEdit() {
        let location = null;
        let cur = options.currentCeil;
        if (isCeil(cur)) {
            cur.innerHTML = null;
            setUneditable()
            for (const key in strEnum.CEIL_ATTR) {
                let attr = strEnum.CEIL_ATTR[key]
                if (cur.hasAttribute(attr)) cur.removeAttribute(attr)
            }
            location = getLocation(cur);
        }
        let key = getIdentify(location);
        let formConfig = options.dataMap[key] || new FormConfig({});
        formConfig.setEdit(null)
        options.dataMap[key] = formConfig
    }

    /**
     * @param arr [page, x, y]
     * @return {string}
     */
    function getIdentify(arr) {
        return `ceil_${arr[0]}_${arr[1]}_${arr[2]}`
    }

    function addCheckbox() {
        let ele = options.currentCeil
        if (!ele) {
            alert('未选择活动单元格');
            return;
        }
        inputCallback = (function () {
            return function (text) {
                if (isCeil(ele)) {
                    ele.innerHTML = ''
                    let location = getLocation(ele);
                    let key = getIdentify(location);
                    let formConfig = options.dataMap[key] || new FormConfig({});
                    let arr = text.split('^');
                    let arrHtml = [];
                    arr.forEach(function (item) {
                        let html = '<input name="checkbox_' + key + '" type="checkbox"/><label>' + item + '</label>'
                        ele.innerHTML += html
                        arrHtml.push(html)
                    })
                    formConfig.setEdit(arrHtml)
                    options.dataMap[key] = formConfig
                }
            }
        })(ele)
        showModal(strEnum.CLASS_NAME.MASK);
    }

    var inputCallback = null

    function showModal(elemId) {
        document.getElementById(elemId).classList.remove(strEnum.CLASS_NAME.HIDE);
    }

    function hideModal(elemId) {
        document.getElementById(elemId).classList.add(strEnum.CLASS_NAME.HIDE);
    }

    function addText() {
        let text = document.getElementById(strEnum.CLASS_NAME.INPUT_TEXT).value;
        hideModal(strEnum.ID_NAME.MASK)
        inputCallback(text)
    }

    function addRadio() {
        let ele = options.currentCeil
        inputCallback = (function () {
            return function (text) {
                if (isCeil(ele)) {
                    ele.innerHTML = ''
                    let location = getLocation(ele);
                    let key = getIdentify(location);
                    let formConfig = options.dataMap[key] || new FormConfig({});
                    let arr = text.split('^');
                    let arrHtml = [];
                    arr.forEach(function (item) {
                        let html = '<input name="radio_' + key + '" type="radio"></input><label>' + item + '</label>'
                        ele.innerHTML += html
                        arrHtml.push(html)
                    })
                    formConfig.setEdit(arrHtml)
                    options.dataMap[key] = formConfig
                }
            }
        })(ele)
        showModal(strEnum.CLASS_NAME.MASK);
    }

    /**
     * 渲染选择框
     */
    function renderSelect() {
        const nowFun = (i, j) => {
            return document.getElementById(getIdentify([options.currentPage, i, j]));
        }
        // 先遍历看看是否包括了合并的单元格
        matrixFun(function (i, j) {
            let now = nowFun(i, j)
            if (now.classList.contains(strEnum.CLASS_NAME.MERGE)) {
                setMinMax(now)
            }
        })
        if (options.last.x == options.first.x && options.first.y == options.last.y) return;
        // 再次遍历, 渲染选择区域
        matrixFun(function (i, j) {
            let now = nowFun(i, j)
            now.classList.add(strEnum.CLASS_NAME.AREA)
        })
        options.selectNum = document.getElementsByClassName(strEnum.CLASS_NAME.AREA).length
    }

    /**
     * 将 div 中的内容转换为 td 内容
     */
    function readOnly(ele) {
        ele.removeAttribute(strEnum.CEIL_ATTR.CONTENTEDITABLE)
    }

    /**
     * 添加对齐方式
     */
    var addAlign = {
        left: function () {

        },
        right: function () {

        },
        center: function () {

        },
    }
    var jsRootPath = function () {
        var jsPath = document.currentScript ? document.currentScript.src : function () {
            var js = document.scripts
                , last = js.length - 1
                , src;
            for (var i = last; i > 0; i--) {
                if (js[i].readyState === 'interactive') {
                    src = js[i].src;
                    break;
                }
            }
            return src || js[last].src;
        }();
        return jsPath.substring(0, jsPath.lastIndexOf('/') + 1);
    }()

    function createEle() {
        let stylewrap = document.getElementById(strEnum.ID_NAME.STYLE)
        if (stylewrap) {
            stylewrap.innerHTML = null
        } else {
            stylewrap = document.createElement("DIV");
            stylewrap.id = strEnum.ID_NAME.STYLE
        }
        stylewrap.classList.add(strEnum.CLASS_NAME.HIDE)
        // 引入必须的样式和 js 库
        // <link rel="stylesheet/less" type="text/css" href="css/style.less" />
        // <script src="./js/lib/less.js"></script>
        if (!options.ifVue && (!window.less || !less)) {
            let lessLink = document.createElement("link");
            lessLink.href = jsRootPath + '../css/style.less';
            lessLink.rel = 'stylesheet/less';
            lessLink.type = 'text/css';
            lessLink.id = strEnum.ID_NAME.LESS;
            console.log("lessLink", lessLink)
            document.head.appendChild(lessLink);
            let lessScript = document.createElement("script");
            lessScript.src = jsRootPath + './lib/less.js'
            document.head.appendChild(lessScript);
        }
        if (isRead()) {
            if (!document.getElementById(strEnum.ID_NAME.PRINT_STYLE)) {
                let printLink = document.createElement("link");
                printLink.id = strEnum.ID_NAME.PRINT_STYLE
                printLink.href = jsRootPath + '../css/print.css';
                printLink.rel = 'stylesheet';
                printLink.media = 'print';
                document.head.appendChild(printLink);
            }
        }

        // <link rel="stylesheet" href="path/to/font-awesome/css/font-awesome.min.css">
        let awesomeLink = document.createElement("link");
        awesomeLink.href = jsRootPath + '../css/font-awesome-4.7.0/css/font-awesome.min.css';
        awesomeLink.rel = 'stylesheet';
        awesomeLink.type = 'text/css';
        document.head.appendChild(awesomeLink);
        var menuEnum = {
            base: {
                saveForm: {
                    el: document.createElement("LI"),
                    text: '保存表单',
                    fun: saveForm
                },
                merge: {
                    el: document.createElement("LI"),
                    text: '合并单元格',
                    fun: merge
                },
                mergeRollback: {
                    el: document.createElement("LI"),
                    text: '取消合并',
                    fun: mergeRollback
                }
            },
            edit: {
                // setAllEdit: {
                //     el: document.createElement("LI"),
                //     text: '格式化表格',
                //     fun: setAllEdit
                // },
                addEdit: {
                    el: document.createElement("LI"),
                    text: '添加编辑',
                    fun: addEdit
                },
                removeEdit: {
                    el: document.createElement("LI"),
                    text: '移除编辑',
                    fun: removeEdit
                },
                align: {
                    el: document.createElement("LI"),
                    text: '对齐方式',
                    children: [{
                        el: document.createElement("LI"),
                        text: '居中对齐',
                        fun: addAlign.center,
                    }, {
                        el: document.createElement("LI"),
                        text: '左对齐',
                        fun: addAlign.left,
                    }, {
                        el: document.createElement("LI"),
                        text: '右对齐',
                        fun: addAlign.right,
                    },]
                },
            },
            elem: {
                addRadio: {
                    el: document.createElement("LI"),
                    text: '单选框',
                    fun: addRadio
                },
                addCheckbox: {
                    el: document.createElement("LI"),
                    text: '复选框',
                    fun: addCheckbox
                },
            }
        }

        var root = document.getElementById(options.rootId);
        root.append(stylewrap)
        var westarTitle = document.createElement("DIV");
        var westarForm = document.createElement("DIV");
        var westarDrag = document.createElement("DIV");
        var dragSearch = document.createElement("INPUT");
        var dragList = document.createElement("DIV");
        var westarMenu = document.createElement("DIV");
        var westarMask = document.createElement("DIV");
        var checkMask = document.createElement("DIV");
        var menuBody = document.createElement("DIV");
        var menuUl = document.createElement("UL");
        var westarMaskEle =
            `<div id="${strEnum.ID_NAME.MODAL}" >\
                    <input type="text" id="${strEnum.ID_NAME.INPUT_TEXT}" placeholder="请输入值, 以^隔开" /><br>\
                    <div>\
                        <input id="${strEnum.ID_NAME.ADD_TEXT}" type="button" value="确认"  >\
                        <input id="${strEnum.ID_NAME.HIDE_MODAL}" type="button" value="取消"  >\
                    </div>\
            </div>`
        westarForm.classList.add(strEnum.CLASS_NAME.FORM_BODY);
        westarForm.id = strEnum.CLASS_NAME.FORM_BODY;
        westarDrag.classList.add(strEnum.CLASS_NAME.DRAG_BODY);
        westarDrag.id = strEnum.CLASS_NAME.DRAG_BODY;
        menuBody.classList.add(strEnum.CLASS_NAME.MENU_BODY);
        westarMenu.id = strEnum.ID_NAME.MENU;
        westarMask.id = strEnum.ID_NAME.MASK;
        checkMask.id = strEnum.ID_NAME.CHECK_MASK;
        westarMask.classList.add(strEnum.CLASS_NAME.HIDE);
        checkMask.classList.add(strEnum.CLASS_NAME.HIDE);
        dragList.id = strEnum.CLASS_NAME.DRAG_LIST;
        dragSearch.id = strEnum.CLASS_NAME.DRAG_SEARCH;
        dragList.classList.add(strEnum.CLASS_NAME.DRAG_LIST);
        dragSearch.classList.add(strEnum.CLASS_NAME.DRAG_SEARCH);
        setEditable(dragSearch, '输入关键字搜索')
        dragSearch.addEventListener("compositionstart", e => {
        })
        dragSearch.addEventListener("compositionend", e => {
            setTimeout(() => {
                genDrag()
            }, 800)
        })
        dragSearch.addEventListener("input", e => {
            setTimeout(() => {
                genDrag()
            }, 800)
        }, false)

        // 标题
        westarTitle.classList.add("westar_form_A4_title")
        westarTitle.classList.add("westar_form_title_song")
        westarTitle.id = strEnum.ID_NAME.TITLE
        westarTitle.innerText = options.title


        // 功能菜单
        for (let m1 in menuEnum) {
            for (let m2 in menuEnum[m1]) {
                let menu = menuEnum[m1][m2];
                menu.el.innerHTML = menu.text;
                if (!!menu.children) {
                    let childUl = document.createElement('UL');
                    // childDiv.classList.add('westar-form-hide');
                    childUl.classList.add(strEnum.CLASS_NAME.MENU_CHILD);
                    menu.children.forEach(function (child) {
                        child.el.innerHTML = child.text;
                        child.el.addEventListener('click', child.fun);
                        childUl.appendChild(child.el);
                    })
                    menu.el.appendChild(childUl)
                    menu.el.addEventListener('mouseover', function () {
                        childUl.classList.remove(strEnum.CLASS_NAME.HIDE)
                    })

                } else {
                    menu.el.addEventListener('click', menu.fun);
                }
                menuUl.appendChild(menu.el);
            }
            menuUl.appendChild(document.createElement("HR"));
        }
        westarMask.innerHTML = westarMaskEle;
        menuBody.appendChild(menuUl);
        westarMenu.appendChild(menuBody);
        westarForm.appendChild(westarTitle);
        stylewrap.appendChild(westarForm);
        stylewrap.appendChild(westarDrag);
        stylewrap.appendChild(westarMenu);
        stylewrap.appendChild(westarMask);
        stylewrap.appendChild(checkMask);
        westarDrag.appendChild(dragSearch)
        westarDrag.appendChild(dragList)
        document.getElementById(strEnum.ID_NAME.ADD_TEXT).addEventListener('click', addText);
        document.getElementById(strEnum.ID_NAME.HIDE_MODAL).addEventListener('click', () => {
            hideModal(strEnum.ID_NAME.MASK)
        });
        document.getElementById(strEnum.ID_NAME.CHECK_MASK).addEventListener('click', () => {
            hideModal(strEnum.ID_NAME.CHECK_MASK)
        });
        // 防止表格被拖动
        westarForm.addEventListener('dragstart', function (e) {
            e.preventDefault();
        });


        /**
         * 添加菜单
         * @param {Object} e
         */
        if (options.mode !== strEnum.MODE.READ) {
            let formBody = document.getElementById(strEnum.CLASS_NAME.FORM_BODY)
            formBody.oncontextmenu = function (e) {
                console.log(e.clientX)
                e.preventDefault();
                let menu = document.getElementById(strEnum.ID_NAME.MENU);
                menu.style.top = (e.clientY + document.body.scrollTop) + 'px';
                menu.style.left = (e.clientX + document.body.scrollLeft) + 'px';
                menu.style.display = 'block';
                window.onclick = function (e) {
                    document.querySelector('#' + strEnum.ID_NAME.MENU).style.display = 'none';
                }
            }
        }

    }

    /**
     * 保存表单
     * @returns {string}
     */
    function saveForm() {
        clearClassName(strEnum.CLASS_NAME.CURRENT)
        clearClassName(strEnum.CLASS_NAME.AREA)
        setAllEdit()
        return checkField()?getFormData():false
    }

    /**
     * 获取表单的所有结构化数据
     */
    function getFormData() {
        let dataMap = options.dataMap;
        for (let key in dataMap) {
            let elem = document.getElementById(key);
            // 保存 div 的值
            options.dataMap[key].edit = elem.innerHTML;
            options.dataMap[key].attrMap = {}
            options.dataMap[key].classList = elem.classList
            // 保存 div attr
            for (const name in strEnum.CEIL_ATTR) {
                let attr = strEnum.CEIL_ATTR[name]
                if (elem.hasAttribute(attr)) {
                    options.dataMap[key].attrMap[attr] = elem.getAttribute(attr)
                }
            }
            document.querySelectorAll(`.${strEnum.CLASS_NAME.FORM_CEIL} input[type=checkbox]`).forEach(chx=>{
                if(chx.checked) chx.setAttribute("checked", "checked")
            })
            document.querySelectorAll(`.${strEnum.CLASS_NAME.FORM_CEIL} input[type=radio]`).forEach(radio=>{
                console.log(radio)
                if(radio.checked) radio.setAttribute("checked", "checked")
            })

        }
        let configStr = JSON.stringify(options)
        localStorage.setItem(strEnum.OPTIONS, configStr)
        let rowJson = JSON.parse(configStr)
        rowJson.fieldList = null
        return JSON.stringify(rowJson)
    }

    /**
     * @param flag 是否直接调用本地存储
     */
    function previewForm(flag) {
        if (!flag) saveForm()
        window.open(jsRootPath + '../preview.html', 'fillForm_preview')
    }

    function printForm() {
        const tableSize = getTableSize()
        let styleBody = document.getElementById(strEnum.ID_NAME.STYLE)
        styleBody.scrollTop = 0
        document.body.scrollTop = document.documentElement.scrollTop = 0
        if (!document.getElementById(strEnum.ID_NAME.PRINT_STYLE_ADD)) {
            var style = document.createElement('style');
            style.id = strEnum.ID_NAME.PRINT_STYLE_ADD
            style.innerHTML = `@media print {
                #${strEnum.ID_NAME.STYLE} {
                    width: ${tableSize.bodyW}px;
                    height: ${tableSize.bodyH * options.pages}px;
                }
            }`;
            window.document.head.appendChild(style);
        }
        window.print()
    }

    /**
     * 检查表单中的键值对是否匹配
     */
    function checkField() {
        const checkMap = new Map()
        let result = ''
        matrixAttr(strEnum.CEIL_ATTR.DATA_FIELD, ele => {
            let dataField = ele.getAttribute(strEnum.CEIL_ATTR.DATA_FIELD)
            let jsonData = JSON.parse(dataField)
            // 获取字段名
            let name = `${jsonData.data.title}(${jsonData.data.name})`
            let pair = checkMap.get(name)
            if (jsonData.type === 'key') {
                pair ? pair[0]++ : checkMap.set(name, [1, 0])
            } else {
                pair ? pair[1]++ : checkMap.set(name, [0, 1])
            }
        })

        checkMap.forEach((v, k) => {
            if (v[0] === 0) result += `<li><i class="fa fa-eercast"></i> 字段 ${k} 没有标题</li>`
            if (v[1] === 0) result += `<li><i class="fa fa-eercast"></i>  字段 ${k} 没有输入区</li>`
            if (k === 'handwrite') {
                if (v[0] !== v[1]) result += `<li> <i class="fa fa-eercast"></i> 手写框标题和输入区数量不对应</li>`
            } else if(k === 'custom') {
               return
            }else {
                if (v[0] > 1) result += `<li> <i class="fa fa-eercast"></i> 字段 ${k} 标题不是唯一</li>`
                if (v[1] > 1) result += `<li> <i class="fa fa-eercast"></i> 字段 ${k} 输入区不是唯一</li>`
            }

        })

        if (!!result) {
            let checkMask = document.getElementById(strEnum.ID_NAME.CHECK_MASK)
            checkMask.innerHTML = `<div class="${strEnum.CLASS_NAME.CHECK_BOX}">
                                    <h3 style="">
                                    <i class="fa fa-exclamation" aria-hidden="true"></i>
                                    表单存在以下问题, 请检查</h3>
                                    <ul>${result}</ul>
                                </div>`
            showModal(strEnum.ID_NAME.CHECK_MASK)
        } else {
            console.log("表单通过字段匹配检查")
        }
        return !result
    }

    function html2canvas(fun) {
        html2canvas(document.getElementById(strEnum.ID_NAME.STYLE)).then(canvas => {
            fun(`<body><img src="${canvas.toDataURL("image/png")}"></body>`)
        });
    }

    function isRead() {
        return options.mode === strEnum.MODE.READ
    }

    function isDrag() {
        return options.mode === strEnum.MODE.DRAG
    }

    function isNoraml() {
        return options.mode === strEnum.MODE.NORMAL
    }

    /**
     *
     */
    function setAllEdit() {
        matrixClass(strEnum.CLASS_NAME.FORM_CEIL, ceil => {
            let children = ceil.childNodes
            if (children.length < 0) {
                return
            }
            if (ceil.classList.contains(strEnum.CLASS_NAME.HIDE)) {
                ceil.innerHTML = ''
            }
            if (!!ceil.innerHTML.replace(/&\w*\d*;/g, '')) {
                readOnly(ceil);
            } else {
                addEdit(ceil);
            }
        })
    }

    /**
     *
     * @return {{width: number, ceilNum2: number, ceilNum: number, height: number}}
     */
    function getTableSize() {
        // 默认就是竖向 a4
        let result = {
            ceilNum: options.ceilNum,
            ceilNum2: options.ceilNum,
            bodyH: strEnum.SIZE.A4.LONG,
            bodyW: strEnum.SIZE.A4.SHORT,
            height: strEnum.SIZE.A4.LONG - 2 * options.offset.top,
            width: strEnum.SIZE.A4.SHORT - 2 * options.offset.left,
            titleH: options.titleH, // 标题高度
            ceilSum: 0,
            ceilSize: 0,
        }
        // 如果是横向 a4
        if (options.style === strEnum.STYLE.A4) {
            if (options.direction === strEnum.DIRECT.H) {
                result.width = strEnum.SIZE.A4.LONG - 2 * options.offset.left
                result.height = strEnum.SIZE.A4.SHORT - 2 * options.offset.top
                result.bodyH = strEnum.SIZE.A4.SHORT
                result.bodyW = strEnum.SIZE.A4.LONG
            }
        }
        let ceilSize = Math.floor(result.width / options.ceilNum)
        result.ceilNum2 = Math.ceil(result.height / ceilSize)
        result.width = ceilSize * result.ceilNum
        result.height = ceilSize * result.ceilNum2
        result.ceilSize = ceilSize
        options.tableSize = result
        return result;
    }

    var _global;
    const options = {
        title: '初始化表单',
        rootId: strEnum.ID_NAME.ROOT_ID,
        movable: null, // 鼠标移动事件对象
        onMove: false, // 是否正在移动中
        ifVue: false, // 是否是 vue
        ifPrint: false, // 是否是打印页面
        selectNum: 0, // 选择的单元格
        currentCeil: null, // 活动单元格
        finalCeil: null, // 最后鼠标落点对象
        ceilNum: 25, // 横向单元格分割数量
        titleH: 150,
        offset: {
            top: 20,
            left: 5
        },
        mode: strEnum.MODE.DRAG,
        first: new FormPoint([0, 0]), // 起点
        last: new FormPoint([0, 0]), // 终点
        dataMap: {}, // data 对象
        style: strEnum.STYLE.A4,
        direction: strEnum.DIRECT.V,
        pages: 1, //表格页数
        currentPage: 0, // 当前表格页
        tableSize: {},
        loadLocal: false,
        fieldValueMap: {},
        fieldList: [
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'checkbox', name: 'fun', title: '功能', options: '编辑^打印^预览'},
            {inputType: 'date', name: 'cancelDate', title: '日期', options: ''},
            {inputType: 'select', name: 'sex', title: '性别', options: '男^女'},
        ]
    }

    function loadLocal() {
        let local = JSON.parse(localStorage.getItem(strEnum.OPTIONS));
        if (!!local) {
            for (let opt_name in options) {
                if (!!local[opt_name]) {
                    options[opt_name] = local[opt_name];
                }
            }
        }
    }

    function guid() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    function WestarForm() {
    }


    WestarForm.prototype = {
        // 初始化
        render: function (settings) {
            if (!!settings) {
                if (!!settings.loadLocal) {
                    loadLocal()
                }
                for (let opt_name in options) {
                    if (settings[opt_name] !== undefined) {
                        options[opt_name] = settings[opt_name];
                    }
                }
            } else {
                loadLocal()
            }
            // 将 json 对象转换为 Object
            options.first = new FormPoint([options.first.x, options.first.y])
            options.last = new FormPoint([options.last.x, options.last.y])
            for (let key in options.dataMap) {
                options.dataMap[key] = new FormConfig(options.dataMap[key]);
            }
            createEle();
            loadForm();
            setTimeout(() => {
                document.getElementById(strEnum.ID_NAME.STYLE).classList.remove(strEnum.CLASS_NAME.HIDE)
            }, 200)
        },
        getFormId: function () {
            return this.formId;
        },
        saveForm: saveForm,
        previewForm: previewForm,
        printForm: printForm,
        checkField: checkField,
        fillField: fillField,
        getFieldMap: getFieldMap,
        getFormData: getFormData,
        formEnum: function () {
            return strEnum
        },
        // 销毁当前表单, 根据新配置重新建立
        rebuild: function (settings) {
            this.destroy();
            this.render(settings);
        },
        // 添加编辑框
        setAllEdit: setAllEdit,
        // 添加页数
        addPage: function (pages) {

        },
        // 删除指定页
        delPage: function (pageNo) {

        },
        // 销毁
        destroy: function () {
            document.getElementById(strEnum.ID_NAME.STYLE).innerHTML = null;
        },
        // 刷新本地存储
        refresh: function () {
            this.destroy();
            this.render();
        }
    }
    WestarForm.prototype.constructor = WestarForm
    _global = (function () {
        return this || (0, eval)('this');
    }())
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = WestarForm;
    } else if (typeof define === 'function' && define.cmd) {
        define(function () {
            return WestarForm;
        })
    } else {
        !('WestarForm' in _global) && (_global.WestarForm = WestarForm)
    }

}())
