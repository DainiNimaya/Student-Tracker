import React, {Component} from "react"
import './scss/_gradingScheme.scss'
import {Input} from "reactstrap"

class AssessmentScheme extends Component {

    state = {
        data: this.props.data
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.setState({data: nextProps.data})
    }

    onSearchHandler = async (e) => {
        const val = e.target.value.trim()
        if (val === '') {
            await this.setState({data: this.props.data})
        } else {
            const filtered = await this.props.data.filter(i => {
                if (i.schemeCode.toLowerCase().includes(val.toLowerCase())) {
                    return i
                }
            })
            await this.setState({data: filtered})
        }
    }

    render() {
        return (
            <>
                <div className={'scheme-container'}
                     style={{minHeight: window.innerHeight - 250, maxHeight: window.innerHeight - 250}}
                    //style={{height: '60vh', overflow: 'hidden'}}
                >
                    <label className={'scheme-title'}>{this.props.title}</label>
                    <div className={'hr'}></div>

                    {this.props.isSearch && <div className={'search-container'}>
                        <Input onChange={this.onSearchHandler} placeholder={this.props.searchPlaceholder}/>
                    </div>}

                    <div className={'scheme-list'}
                         style={{
                             minHeight: window.innerHeight - 420,
                             maxHeight: window.innerHeight - 420,
                             overflowX: 'hidden',
                             overflowY: 'scroll'
                         }}
                        //style={{height: '50vh', overflowX: 'hidden', overflowY: 'scroll'}}
                    >
                        {
                            this.state.data.map((item, i) => <div onClick={() => this.props.onSelect(item, i)} key={i}
                                                                  className={'scheme-row'}>
                                <label className={'scheme-label'}>{item.schemeCode}</label>
                            </div>)
                        }
                    </div>
                </div>
            </>
        )
    }
}

export default AssessmentScheme
