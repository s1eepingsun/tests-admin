//найти повторения правильных ответов (answer1) в последующих тестах
function correctAnswerDuplicateCheck() {
    var tasks = testApp.testModel.data.tasks;
    var correct = [];
    for(taskNum in tasks) {
        if(!tasks.hasOwnProperty(taskNum)) continue;

        correct.push(tasks[taskNum]['answers']['answer1']);
    }
    console.log('correct', correct);
    for(taskNum in tasks) {
        if (!tasks.hasOwnProperty(taskNum)) continue;

        for(answer in tasks[taskNum]['answers']) {
            if (!tasks[taskNum]['answers'].hasOwnProperty(answer)) continue;
            if(answer === 'answer1') continue;
            //console.log('tasks[taskNum][answers][answer]', tasks[taskNum]['answers'][answer]);

            if(correct.indexOf(tasks[taskNum]['answers'][answer]) > -1 &&
                correct.indexOf(tasks[taskNum]['answers'][answer]) < taskNum) {
                console.log('in task ' + taskNum + ' ' + tasks[taskNum]['answers'][answer] + ' is found in ', Number(correct.indexOf(tasks[taskNum]['answers'][answer])) + 1);
            }
        }
    }
}