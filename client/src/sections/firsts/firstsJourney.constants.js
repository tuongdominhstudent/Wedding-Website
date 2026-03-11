export const FIRSTS_SECTION = Object.freeze({
  pathId: 'firsts-road-path',
  viewBox: '0 0 1000 1800',
  path: `
    M 510 120
    C 690 230, 730 370, 560 500
    C 355 660, 350 805, 520 930
    C 705 1065, 715 1215, 535 1340
    C 340 1470, 350 1600, 545 1715
  `,
  riderScaleDesktop: 1,
  riderScaleMobile: 0.78,
  pinDistanceDesktop: 2.45,
  pinDistanceMobile: 2.85,
  milestoneRevealWindow: 0.035,
  storyActivationBuffer: 0.012,
  milestones: [
    { id: 'first-meet', label: 'LẦN GẶP ĐẦU TIÊN', progress: 0.08, dx: -160, dy: -120, align: 'left' },
    {
      id: 'first-date-out',
      label: 'LẦN ĐI CHƠI ĐẦU TIÊN',
      progress: 0.2,
      dx: -280,
      dy: 24,
      align: 'left',
      photoKey: 'hangOut',
      story:
        'Chúng mình cùng đi với cả nhóm tới một quán Biliard chơi, hai đứa cứ tíu ta tíu tít ai cũng thấy có lẽ chúng mình đã "ưng" nhau luôn từ giây phút đó rồi. Tường còn tiện tay xoa đầu Nguyn để nàng í tơ tưởng nhớ nhung suốt ấy chứ.'
    },
    {
      id: 'first-hand-hold',
      label: 'LẦN NẮM TAY ĐẦU TIÊN',
      progress: 0.43,
      dx: 32,
      dy: -12,
      align: 'right',
      photoKey: 'holdHand',
      story:
        'Còn một chút bẽn lẽn ngại ngùng và đâu đó là những nụ cười nhỏ bé với đôi bàn tay đan ngón tay trên xe của một tình yêu chớm nở cuối chiều đông.'
    },
    {
      id: 'first-romantic-date',
      label: 'LẦN HẸN HÒ ĐẦU TIÊN',
      progress: 0.6,
      dx: 20,
      dy: 6,
      align: 'left',
      photoKey: 'date',
      story:
        'Cùng nhau đi khắp từng con phố nhỏ nơi Hà Nội dấu yêu, là Hồ Tây khi anh nhìn em cười và đôi mắt sẽ cùng anh đi từ những năm tháng đôi mươi tới hết cuộc đời.'
    },
    {
      id: 'first-bouquet',
      label: 'BÓ HOA ĐẦU TIÊN',
      progress: 0.77,
      dx: -240,
      dy: -22,
      align: 'right',
      photoKey: 'flower',
      story:
        'Bó hoa đầu Tường tặng Nguyn khi cả 2 đứa cùng đi chơi ở bến Metro Cát Linh - Hà Đông, cũng chính thức gọi nhau là người iu.'
    },
    {
      id: 'first-dinner',
      label: 'CHUYẾN ĐI ĐẦU TIÊN',
      progress: 0.91,
      dx: 28,
      dy: 24,
      align: 'left',
      photoKey: 'trip'
    }
  ]
});
