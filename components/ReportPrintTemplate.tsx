
import React, { Fragment } from 'react';
import { Report, ReportType } from '../types';
import { ArrowLeft } from 'lucide-react';

interface PrintProps {
  report: Report;
  projectName?: string;
  isPreview?: boolean;
  onClose?: () => void;
}

export const ReportPrintTemplate: React.FC<PrintProps> = ({ report, projectName, isPreview = false, onClose }) => {
  const d = report.details || {};
  
  const containerClass = isPreview 
    ? "relative p-4 md:p-14 bg-white shadow-2xl mx-auto w-full max-w-[210mm] min-h-[297mm] overflow-hidden" 
    : "print-only p-[20mm] bg-white text-black font-serif w-[210mm] min-h-[297mm] mx-auto text-sm";

  const renderSpecificFields = () => {
    switch (report.type) {
      case ReportType.WITNESS: {
        return (
          <Fragment>
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold tracking-[0.2em] mb-4">工程质量见证记录表</h1>
              <div className="border-b-2 border-black w-24 mx-auto mb-8"></div>
            </div>
            <table className="w-full border-collapse border-2 border-black">
              <tbody>
                <tr>
                  <td className="border border-black p-4 w-[120px] font-bold bg-slate-50/50 text-center">工程名称</td>
                  <td className="border border-black p-4" colSpan={3}>{projectName}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold bg-slate-50/50 text-center">见证项目</td>
                  <td className="border border-black p-4 w-[35%]">{d.witnessItem}</td>
                  <td className="border border-black p-4 font-bold bg-slate-50/50 text-center w-[120px]">见证日期</td>
                  <td className="border border-black p-4">{d.witnessDate}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold bg-slate-50/50 text-center">见证部位</td>
                  <td className="border border-black p-4">{d.part}</td>
                  <td className="border border-black p-4 font-bold bg-slate-50/50 text-center">规格/批次</td>
                  <td className="border border-black p-4">{d.spec || d.quantity}</td>
                </tr>
                <tr>
                  <td className="border border-black p-6 align-top" colSpan={4}>
                    <div className="min-h-[600px] flex flex-col">
                      <div className="font-bold text-base mb-6 underline">见证内容及结论：</div>
                      <div className="flex-1 pl-4 leading-loose text-justify text-base">
                        {d.witnessResult}
                      </div>
                      <div className="mt-20 grid grid-cols-2 gap-20">
                        <div className="space-y-4">
                          <p className="font-bold">施工单位见证人：</p>
                          <div className="border-b border-black w-48 h-8"></div>
                        </div>
                        <div className="space-y-4">
                          <p className="font-bold">监理单位见证人：</p>
                          <div className="border-b border-black w-48 h-8"></div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Fragment>
        );
      }
      case ReportType.MAJOR_EVENT: {
        return (
          <Fragment>
            <div className="text-center mb-10 text-red-600">
              <h1 className="text-4xl font-bold tracking-[0.3em] mb-4">重大事项直报/审批单</h1>
              <div className="flex justify-between items-end px-2 mt-12 text-black">
                <div className="flex flex-col items-start gap-1">
                  <span className="font-bold">类别：{d.eventCategory}</span>
                  <span className="font-bold text-red-600">程度：{d.urgency}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold">报告编号：HE-{report.id.substring(0,6).toUpperCase()}</span>
                </div>
              </div>
            </div>
            <table className="w-full border-collapse border-2 border-black">
              <tbody>
                <tr>
                  <td className="border border-black p-4 w-[120px] font-bold bg-slate-50/50 text-center">项目名称</td>
                  <td className="border border-black p-4" colSpan={3}>{projectName}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold bg-slate-50/50 text-center">报告人员</td>
                  <td className="border border-black p-4 w-[35%]">{report.authorName}</td>
                  <td className="border border-black p-4 font-bold bg-slate-50/50 text-center w-[120px]">报告时间</td>
                  <td className="border border-black p-4">{report.date}</td>
                </tr>
                <tr>
                  <td className="border border-black p-6 align-top" colSpan={4}>
                    <div className="space-y-10 min-h-[400px]">
                      <div>
                        <div className="font-bold text-base mb-4 border-l-4 border-red-600 pl-3">一、事件详情描述：</div>
                        <div className="pl-6 leading-relaxed text-justify">{d.eventDesc}</div>
                      </div>
                      <div>
                        <div className="font-bold text-base mb-4 border-l-4 border-red-600 pl-3">二、已采取紧急措施：</div>
                        <div className="pl-6 leading-relaxed text-justify">{d.measures}</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-6 align-top h-[180px]" colSpan={4}>
                    <div className="font-bold text-base mb-4">总监理工程师意见：</div>
                    <div className="mt-20 text-right pr-10">签字：_________________ 日期：____年__月__日</div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-6 align-top h-[180px]" colSpan={4}>
                    <div className="font-bold text-base mb-4">公司管理层批示：</div>
                    <div className="pl-6 text-slate-400 italic">（此处预留审批位置）</div>
                    <div className="mt-20 text-right pr-10">签字：_________________ 日期：____年__月__日</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Fragment>
        );
      }
      case ReportType.MONTHLY: {
        return (
          <Fragment>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-[0.2em] mb-8">工程监理情况月报</h1>
            </div>
            
            <table className="w-full border-collapse border-2 border-black">
              <tbody>
                <tr>
                  <td className="border border-black p-3 w-[100px] font-bold bg-slate-50/50 text-center">工程名称</td>
                  <td className="border border-black p-3" colSpan={1}>{projectName}</td>
                  <td className="border border-black p-3 w-[100px] font-bold bg-slate-50/50 text-center">填报日期</td>
                  <td className="border border-black p-3 w-[120px]">{report.date}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold bg-slate-50/20 text-center align-middle h-24">进度完成情况</td>
                  <td className="border border-black p-4 align-top" colSpan={3}>
                    <div className="min-h-[100px] whitespace-pre-wrap leading-relaxed">{d.progressStatus}</div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold bg-slate-50/20 text-center align-middle h-24">质量控制情况</td>
                  <td className="border border-black p-4 align-top" colSpan={3}>
                    <div className="min-h-[100px] whitespace-pre-wrap leading-relaxed">{d.qualityStatus}</div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold bg-slate-50/20 text-center align-middle h-24">投资控制情况</td>
                  <td className="border border-black p-4 align-top" colSpan={3}>
                    <div className="min-h-[100px] whitespace-pre-wrap leading-relaxed">{d.investmentStatus}</div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-4 font-bold bg-slate-50/20 text-center align-middle h-24">安全控制情况</td>
                  <td className="border border-black p-4 align-top" colSpan={3}>
                    <div className="min-h-[100px] whitespace-pre-wrap leading-relaxed">{d.safetyStatus}</div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-6 align-top" colSpan={4}>
                    <div className="min-h-[450px] space-y-4">
                      <div className="font-bold leading-loose">本月监理工作综合评述及下月监理工作重点：</div>
                      <div className="pl-4 whitespace-pre-wrap leading-relaxed text-justify">
                        {d.monthlyReview || '（此处请填写详细评述内容）'}
                      </div>
                      <div className="font-bold mt-10 pt-10">下月工作重点：</div>
                      <div className="pl-4 leading-relaxed italic text-slate-400">....</div>
                    </div>
                    <div className="mt-20 text-right font-bold pr-10">
                      ....................................................................总监理工程师：
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Fragment>
        )
      }
      case ReportType.MINUTES: {
        return (
          <Fragment>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-[0.2em] mb-8">监理例会会议纪要</h1>
            </div>
            <table className="w-full border-collapse border-2 border-black">
              <tbody>
                <tr>
                  <td className="border border-black p-3 w-[100px] font-bold bg-slate-50/50">工程名称:</td>
                  <td className="border border-black p-3">{projectName}</td>
                  <td className="border border-black p-3 w-[80px] font-bold bg-slate-50/50 text-center">主持人:</td>
                  <td className="border border-black p-3 w-[120px]">{d.host}</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-slate-50/50">会议时间:</td>
                  <td className="border border-black p-3">{d.meetTime ? d.meetTime.replace('T', ' ') : ''}</td>
                  <td className="border border-black p-3 font-bold bg-slate-50/50 text-center">会议地点:</td>
                  <td className="border border-black p-3">{d.location}</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-slate-50/50 align-top" rowSpan={4}>参建单位</td>
                  <td className="border border-black p-3 font-bold w-[100px] bg-slate-50/20">建设单位:</td>
                  <td className="border border-black p-3" colSpan={2}>{d.clientUnit}</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-slate-50/20">施工单位:</td>
                  <td className="border border-black p-3" colSpan={2}>{d.contractorUnit}</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-slate-50/20">监理单位:</td>
                  <td className="border border-black p-3" colSpan={2}>{d.supervisorUnit}</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-slate-50/20">其他单位:</td>
                  <td className="border border-black p-3" colSpan={2}>{d.othersUnit || '无'}</td>
                </tr>
                <tr>
                  <td className="border border-black p-6 align-top" colSpan={4}>
                    <div className="min-h-[650px] space-y-8">
                      <div className="font-bold text-base mb-4">会议内容：</div>
                      <div className="space-y-2">
                        <div className="font-bold pl-2">一、施工单位内容：</div>
                        <div className="pl-10 leading-relaxed text-justify">{d.contractorContent}</div>
                      </div>
                      <div className="space-y-3">
                        <div className="font-bold pl-2">二、监理单位内容：</div>
                        <div className="pl-6 space-y-2">
                          <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">质量问题：</span>
                            <span className="text-justify">{d.qualityIssues}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">进度问题：</span>
                            <span className="text-justify">{d.progressIssues}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">安全文明施工：</span>
                            <span className="text-justify">{d.safetyIssues}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="font-bold whitespace-nowrap">其他：</span>
                            <span className="text-justify">{d.otherSupervision}</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-bold pl-2">三、建设单位内容：</div>
                        <div className="pl-10 leading-relaxed text-justify">{d.clientContent}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-bold pl-2">四、需要解决的问题：</div>
                        <div className="pl-10 leading-relaxed text-justify">{d.unresolved}</div>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Fragment>
        )
      }
      case ReportType.NOTICE: {
        const nDate = (report.date || '').split('-');
        return (
          <Fragment>
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold tracking-[0.5em] mb-8">监理通知单</h1>
              <div className="flex justify-between items-center text-sm font-bold px-1">
                <div>工程名称：<span className="border-b border-black min-w-[200px] inline-block text-left px-2">{projectName}</span></div>
                <div>编号：<span className="border-b border-black min-w-[120px] inline-block text-left px-2">{report.id.substring(0, 8).toUpperCase()}</span></div>
              </div>
            </div>
            <div className="border-2 border-black p-8 min-h-[850px] relative flex flex-col">
              <div className="mb-6">
                <div className="font-bold text-base mb-4">致：<span className="border-b border-black inline-block min-w-[300px] px-2">{d.recipient}</span></div>
              </div>
              <div className="space-y-8 flex-1">
                <div className="flex gap-2">
                  <span className="font-bold whitespace-nowrap">事由：</span>
                  <div className="whitespace-pre-wrap leading-relaxed">{d.reason}</div>
                </div>
                <div className="space-y-4">
                  <span className="font-bold block">存在的问题：</span>
                  <div className="pl-6 whitespace-pre-wrap leading-loose min-h-[150px] text-justify">{d.problems}</div>
                </div>
                <div className="space-y-4">
                  <span className="font-bold block">通知内容：</span>
                  <div className="pl-6 whitespace-pre-wrap leading-loose min-h-[300px] text-justify">{d.noticeContent}</div>
                </div>
                <div className="font-bold mt-10">特此通知！</div>
              </div>
              <div className="mt-auto pt-10 text-right space-y-4">
                <div className="font-bold">项目监理机构(盖章)：新疆成汇工程管理有限公司</div>
                <div className="font-bold">总/专业监理工程师(签字)：_________________</div>
                <div className="font-bold pr-4">日期： 20{nDate[0] ? nDate[0].substring(2) : ''} 年 {nDate[1] || ''} 月 {nDate[2] || ''} 日</div>
              </div>
            </div>
          </Fragment>
        )
      }
      case ReportType.DAILY_LOG: {
        const dateParts = (report.date || '').split('-');
        return (
          <Fragment>
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold tracking-[0.5em] mb-6">监理日志</h1>
              <div className="flex justify-between items-center text-sm font-bold px-2">
                <div className="flex gap-4">
                  <span>{dateParts[0] || ''} 年</span>
                  <span>{dateParts[1] || ''} 月</span>
                  <span>{dateParts[2] || ''} 日</span>
                </div>
                <div>天气：<span className="border-b border-black min-w-[60px] inline-block text-center px-2">{d.weather}</span></div>
                <div>温度：<span className="border-b border-black min-w-[60px] inline-block text-center px-2">{d.temp}</span></div>
              </div>
            </div>
            <table className="w-full border-collapse border-2 border-black">
              <tbody>
                <tr>
                  <td className="border border-black p-3 w-[80px] font-bold">项目名称:</td>
                  <td className="border border-black p-3" colSpan={3}>{projectName}</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold">施工地点:</td>
                  <td className="border border-black p-3" colSpan={3}>{d.location}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 align-top" colSpan={4}>
                    <div className="min-h-[700px] flex flex-col space-y-6">
                      <div className="space-y-2">
                        <div className="font-bold">人员：</div>
                        <div className="pl-6">{d.personnel}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-bold">机械：</div>
                        <div className="pl-6">{d.machinery}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-bold">材料：</div>
                        <div className="pl-6">{d.materials}</div>
                      </div>
                      <div className="space-y-2">
                        <div className="font-bold">施工情况：</div>
                        <div className="pl-6 whitespace-pre-wrap leading-relaxed">{d.progress}</div>
                      </div>
                      <div className="space-y-2 flex-1">
                        <div className="font-bold">监理情况：</div>
                        <div className="pl-6 whitespace-pre-wrap leading-relaxed">{d.supervision}</div>
                      </div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-4 align-top" colSpan={4}>
                    <div className="font-bold mb-2">其他：</div>
                    <div className="min-h-[100px] pl-6">{d.others}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Fragment>
        )
      }
      case ReportType.SIDE_STATION: {
        return (
          <Fragment>
            <div className="text-center mb-10">
              <h1 className="text-4xl font-bold tracking-[1em] ml-[1em] mb-8">
                <span className="text-5xl font-serif">A</span> 旁 站 记 录
              </h1>
              <div className="text-left font-bold text-lg mt-10">
                工程名称：<span className="border-b border-black px-4 inline-block min-w-[300px]">{projectName}</span>
              </div>
            </div>
            <table className="w-full border-collapse border-2 border-black text-sm">
              <tbody>
                <tr>
                  <td className="border border-black p-3 font-bold bg-slate-50 w-[20%] text-center">旁站部位</td>
                  <td className="border border-black p-3 w-[30%]">{d.keyPart}</td>
                  <td className="border border-black p-3 font-bold bg-slate-50 w-[20%] text-center">施工单位</td>
                  <td className="border border-black p-3 w-[30%]">{d.contractor}</td>
                </tr>
                <tr>
                  <td className="border border-black p-3 font-bold bg-slate-50 text-center">开始时间</td>
                  <td className="border border-black p-3">{d.startTime ? d.startTime.replace('T', ' ') : ''}</td>
                  <td className="border border-black p-3 font-bold bg-slate-50 text-center">结束时间</td>
                  <td className="border border-black p-3">{d.endTime ? d.endTime.replace('T', ' ') : ''}</td>
                </tr>
                <tr>
                  <td className="border border-black p-4 align-top" colSpan={4}>
                    <div className="font-bold mb-3">施工情况：</div>
                    <div className="min-h-[400px]">{d.processDetail}</div>
                  </td>
                </tr>
                <tr>
                  <td className="border border-black p-4 align-top" colSpan={4}>
                    <div className="font-bold mb-3">问题及处理：</div>
                    <div className="min-h-[250px]">{d.problems}</div>
                    <div className="mt-12 text-right font-bold">旁站监理人员（签字）：_________________</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </Fragment>
        )
      }
      default:
        return (
          <div className="p-10 text-center italic text-slate-400">
            该文书类型暂无标准表格模版
          </div>
        )
    }
  };

  return (
    <div className={containerClass} id={`report-print-area-${report.id}`}>
      {isPreview && onClose && (
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 bg-slate-800 text-white p-2 rounded-full no-print flex items-center gap-2 px-4 shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-xs font-bold">关闭预览</span>
        </button>
      )}
      {renderSpecificFields()}
      <div className="mt-10 text-[10px] text-slate-400 text-center italic no-print">
        * 本文书由 成汇数字平台 生成
      </div>
    </div>
  );
};
